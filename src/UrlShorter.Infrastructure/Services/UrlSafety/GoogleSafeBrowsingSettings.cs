namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class GoogleSafeBrowsingSettings
{
    public bool Enabled { get; init; } = true;
    public string ApiKey { get; init; } = string.Empty;
}
