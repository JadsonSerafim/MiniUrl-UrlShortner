namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;

public record ClickLogDto(
    string IpAddress,
    string? UserAgent,
    DateTime OccurredAt
);
