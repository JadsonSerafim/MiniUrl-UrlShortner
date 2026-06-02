namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;

public record UrlAnalyticsResponse(
    string ShortCode,
    string OriginalUrl,
    int TotalClicks,
    List<ClickLogDto> Clicks
);
