namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public record ClickEvent(
    string ShortCode, 
    string? IpAddress, 
    string? UserAgent, 
    DateTime OccurredAt);
