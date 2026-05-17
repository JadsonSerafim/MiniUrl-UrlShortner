using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public class GetOriginalUrlHandler : IRequestHandler<GetOriginalUrlQuery, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;

    public GetOriginalUrlHandler(IShortenedUrlRepository shortenedUrlRepository, IUnitOfWork unitOfWork)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<string>> Handle(GetOriginalUrlQuery request, CancellationToken cancellationToken)
    {
        var shortenedUrl = await _shortenedUrlRepository.GetByShortCodeAsync(request.ShortCode);
        
        if (shortenedUrl is null)
        {
            return ErrorsUrl.NotFound;
        }

        if (shortenedUrl.IsExpired())
        {
            return ErrorsUrl.Expired; 
        }

        shortenedUrl.RegisterClick();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return shortenedUrl.OriginalUrl.Value;
    }
}
