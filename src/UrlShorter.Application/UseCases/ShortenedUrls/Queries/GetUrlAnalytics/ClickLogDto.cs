namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;

public record ClickLogDto(
    string IpAddress,
    string? Browser,
    string? OperatingSystem,
    DateTime OccurredAt
);
