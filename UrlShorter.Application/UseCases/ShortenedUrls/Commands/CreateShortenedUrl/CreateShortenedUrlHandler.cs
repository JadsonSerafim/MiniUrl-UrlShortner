using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public class CreateShortenedUrlHandler : IRequestHandler<CreateShortenedUrlCommand, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IShortCodeGenerator _shortCodeGenerator;
    private readonly IUrlSafetyService _urlSafetyService;

    public CreateShortenedUrlHandler(
        IShortenedUrlRepository shortenedUrlRepository,
        IUnitOfWork unitOfWork,
        IShortCodeGenerator shortCodeGenerator,
        IUrlSafetyService urlSafetyService)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _shortCodeGenerator = shortCodeGenerator;
        _urlSafetyService = urlSafetyService;
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

        int activeCount = 0;
        if (request.UserId != null)
        {
            activeCount = await _shortenedUrlRepository.CountActiveByUserIdAsync(request.UserId.Value, cancellationToken);
        }

        int maxTries = 5;
        var urlResult = Url.Create(request.OriginalUrl);
        if (urlResult.IsFailure)
        {
            return Result<string>.Failure(urlResult.Error);
        }

        var safetyStatus = await _urlSafetyService.CheckUrlSafetyAsync(request.OriginalUrl, cancellationToken);
        if (safetyStatus == UrlSafetyStatus.Danger)
        {
            return Result<string>.Failure(ErrorsUrlSafety.MaliciousUrl);
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

        var shortenedUrlResult = ShortenedUrl.Create(urlResult.Value, shortCode, request.UserId, request.ExpiresAt, activeCount, request.Name, safetyStatus);
        if(shortenedUrlResult.IsFailure) return Result<string>.Failure(shortenedUrlResult.Error);

        await _shortenedUrlRepository.AddAsync(shortenedUrlResult.Value, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(shortCode);
    }
}
