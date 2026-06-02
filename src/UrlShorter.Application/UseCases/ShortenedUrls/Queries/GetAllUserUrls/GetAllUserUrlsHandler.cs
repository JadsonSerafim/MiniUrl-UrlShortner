using MediatR;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetAllUserUrls;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetAllUserUrls;

public class GetAllUserUrlsHandler : IRequestHandler<GetAllUserUrlsQuery, Result<List<ShortenedUrl>>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    public GetAllUserUrlsHandler(IShortenedUrlRepository shortenedUrlRepository)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
    }

    public async Task<Result<List<ShortenedUrl>>> Handle(GetAllUserUrlsQuery request, CancellationToken cancellationToken)
    {
        var urls = await _shortenedUrlRepository.GetAllUserUrlsAsync(request.UserId, cancellationToken);

        if (urls.Count == 0)
        {
            return ErrorsUrl.NotFound;
        }

        return urls;
    }
}
