using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;

public class GetUrlAnalyticsHandler : IRequestHandler<GetUrlAnalyticsQuery, Result<UrlAnalyticsResponse>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IClickLogRepository _clickLogRepository;

    public GetUrlAnalyticsHandler(
        IShortenedUrlRepository shortenedUrlRepository,
        IClickLogRepository clickLogRepository)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _clickLogRepository = clickLogRepository;
    }

    public async Task<Result<UrlAnalyticsResponse>> Handle(GetUrlAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var url = await _shortenedUrlRepository.GetByShortCodeAsync(request.ShortCode);

        if (url == null)
        {
            return ErrorsUrl.NotFound;
        }

        if (url.UserId != request.UserId)
        {
            return ErrorsUrl.NotFound;
        }

        var clicks = await _clickLogRepository.GetByShortCodeAsync(request.ShortCode, cancellationToken);

        var clickDtos = clicks.Select(c => new ClickLogDto(
            c.IpAddress.Value,
            c.UserAgent,
            c.CreatedAt
        )).ToList();

        var response = new UrlAnalyticsResponse(
            url.ShortCode,
            url.OriginalUrl.Value,
            url.ClickCount,
            clickDtos
        );

        return response;
    }
}
