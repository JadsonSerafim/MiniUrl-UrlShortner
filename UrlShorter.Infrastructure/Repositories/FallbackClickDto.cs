namespace UrlShorter.Infrastructure.Repositories;

public record FallbackClickDto
{
    public string ShortCode { get; init; } = string.Empty;
    public string? IpAddress { get; init; }
    public string? UserAgent { get; init; }
    public DateTime OccurredAt { get; init; }
}
