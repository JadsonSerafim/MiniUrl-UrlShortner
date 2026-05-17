using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public class CreateShortenedUrlHandler : IRequestHandler<CreateShortenedUrlCommand, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IShortCodeGenerator _shortCodeGenerator;

    public CreateShortenedUrlHandler(IShortenedUrlRepository shortenedUrlRepository, IUnitOfWork unitOfWork, IShortCodeGenerator shortCodeGenerator)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _shortCodeGenerator = shortCodeGenerator;
    }

    public async Task<Result<string>> Handle(CreateShortenedUrlCommand request, CancellationToken cancellationToken)
    {
         int tentativas_maxima = 5;
        var urlResult = Url.Create(request.OriginalUrl);
        if (urlResult.IsFailure)
        {
            return Result<string>.Failure(urlResult.Error);
        }

        string shortCode = _shortCodeGenerator.Generate();
        
        while(await _shortenedUrlRepository.ShortCodeExistsAsync(shortCode, cancellationToken))
        {
            if(tentativas_maxima == 0)
            {
                return ErrorsUrl.ShortCodeAlreadyExists;
            }

            shortCode = _shortCodeGenerator.Generate();

            tentativas_maxima--;
        }

        var shortenedUrlResult = ShortenedUrl.Create(urlResult.Value, shortCode, request.UserId, request.ExpiresAt);
        if(shortenedUrlResult.IsFailure) return Result<string>.Failure(shortenedUrlResult.Error);

        await _shortenedUrlRepository.AddAsync(shortenedUrlResult.Value, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(shortCode);
    }
}
