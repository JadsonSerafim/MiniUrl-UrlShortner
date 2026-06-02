namespace UrlShorter.Infrastructure.Services;

public class WhoisSettings
{
    public const string SectionName = "Whois";
    public string ApiKey { get; init; } = string.Empty;
    public string BaseUrl { get; init; } = "https://api.ip2whois.com/v2";
}
