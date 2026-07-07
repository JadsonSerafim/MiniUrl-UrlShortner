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
            ParseBrowser(c.UserAgent),
            ParseOperatingSystem(c.UserAgent),
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

    private static string ParseBrowser(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return "Desconhecido";

        var ua = userAgent.ToLowerInvariant();
        if (ua.Contains("firefox")) return "Firefox";
        if (ua.Contains("edg") || ua.Contains("edge")) return "Edge";
        if (ua.Contains("opr") || ua.Contains("opera")) return "Opera";
        if (ua.Contains("chrome")) return "Chrome";
        if (ua.Contains("safari")) return "Safari";
        return "Outro";
    }

    private static string ParseOperatingSystem(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return "Desconhecido";

        var ua = userAgent.ToLowerInvariant();
        if (ua.Contains("windows")) return "Windows";
        if (ua.Contains("macintosh") || ua.Contains("mac os")) return "macOS";
        if (ua.Contains("linux")) return "Linux";
        if (ua.Contains("android")) return "Android";
        if (ua.Contains("iphone") || ua.Contains("ipad")) return "iOS";
        return "Outro";
    }
}
