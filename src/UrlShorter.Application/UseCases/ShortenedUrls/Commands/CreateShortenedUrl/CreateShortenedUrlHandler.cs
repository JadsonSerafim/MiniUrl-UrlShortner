using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.Settings;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public class CreateShortenedUrlHandler : IRequestHandler<CreateShortenedUrlCommand, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IShortCodeGenerator _shortCodeGenerator;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IDomainSafetyService _domainSafetyService;
    private readonly IRedirectChecker _redirectChecker;
    private readonly BlockedShortenersSettings _blockedShortenersSettings;

    public CreateShortenedUrlHandler(
        IShortenedUrlRepository shortenedUrlRepository,
        IUnitOfWork unitOfWork,
        IShortCodeGenerator shortCodeGenerator,
        IServiceScopeFactory scopeFactory,
        IDomainSafetyService domainSafetyService,
        IRedirectChecker redirectChecker,
        IOptions<BlockedShortenersSettings> blockedShortenersSettings)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _shortCodeGenerator = shortCodeGenerator;
        _scopeFactory = scopeFactory;
        _domainSafetyService = domainSafetyService;
        _redirectChecker = redirectChecker;
        _blockedShortenersSettings = blockedShortenersSettings.Value;
    }

    public async Task<Result<string>> Handle(CreateShortenedUrlCommand request, CancellationToken cancellationToken)
    {

        if (request.UserId == null)
        {
            var existingUrl = await _shortenedUrlRepository.GetActiveGuestUrlAsync(request.OriginalUrl, cancellationToken);
            if (existingUrl != null)
            {
                return Result<string>.Success(existingUrl.ShortCode);
            }
        }
        else
        {
            var existingUrl = await _shortenedUrlRepository.GetActiveUserUrlAsync(request.UserId.Value, request.OriginalUrl, cancellationToken);
            if (existingUrl != null)
            {
                return Result<string>.Success(existingUrl.ShortCode);
            }
        }

        int activeCount = 0;
        if (request.UserId != null)
        {
            activeCount = await _shortenedUrlRepository.CountActiveByUserIdAsync(request.UserId.Value, cancellationToken);
        }

        int maxTries = 5;

        var redirectCheck = await _redirectChecker.CheckRedirectChainAsync(request.OriginalUrl, cancellationToken);
        if (redirectCheck.IsRedirect)
        {
            return Result<string>.Failure(ErrorsUrl.ChainRedirectDetected);
        }

        var urlResult = Url.Create(request.OriginalUrl, _blockedShortenersSettings.Domains);
        if (urlResult.IsFailure)
        {
            return Result<string>.Failure(urlResult.Error);
        }

        if (await _domainSafetyService.IsDomainTooYoungAsync(request.OriginalUrl, cancellationToken))
        {
            return Result<string>.Failure(ErrorsUrl.DomainTooYoung);
        }

        string shortCode = _shortCodeGenerator.Generate();
        while(await _shortenedUrlRepository.ShortCodeExistsAndActiveAsync(shortCode, cancellationToken))
        {
            if(maxTries == 0)
            {
                return ErrorsUrl.ShortCodeAlreadyExists;
            }

            shortCode = _shortCodeGenerator.Generate();

            maxTries--;
        }

        var existingExpiredUrl = await _shortenedUrlRepository.GetByShortCodeAsync(shortCode);
        if (existingExpiredUrl != null && existingExpiredUrl.IsActive)
        {
            existingExpiredUrl.Deactivate();
            await _shortenedUrlRepository.UpdateAsync(existingExpiredUrl, cancellationToken);
        }

        var shortenedUrlResult = ShortenedUrl.Create(urlResult.Value, shortCode, request.UserId, request.ExpiresAt, activeCount, request.Name, UrlSafetyStatus.Pending);
        if(shortenedUrlResult.IsFailure) return Result<string>.Failure(shortenedUrlResult.Error);

        await _shortenedUrlRepository.AddAsync(shortenedUrlResult.Value, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var urlToCheck = request.OriginalUrl;
        var capturedShortCode = shortCode;
        _ = Task.Run(async () =>
        {
            using var scope = _scopeFactory.CreateScope();
            var safetyService = scope.ServiceProvider.GetRequiredService<IUrlSafetyService>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var repository = scope.ServiceProvider.GetRequiredService<IShortenedUrlRepository>();

            var status = await safetyService.CheckUrlSafetyAsync(urlToCheck);
            var url = await repository.GetByShortCodeAsync(capturedShortCode);
            if (url is not null)
            {
                url.UpdateSafetyStatus(status);
                await repository.UpdateAsync(url);
                await unitOfWork.SaveChangesAsync();
            }
        });

        return Result<string>.Success(shortCode);
    }
}
