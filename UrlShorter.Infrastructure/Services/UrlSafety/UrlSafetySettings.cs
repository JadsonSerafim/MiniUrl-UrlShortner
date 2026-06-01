namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class UrlSafetySettings
{
    public const string SectionName = "UrlSafety";

    public bool Enabled { get; init; } = true;
    public int CheckTimeoutSeconds { get; init; } = 5;
    public GoogleSafeBrowsingSettings GoogleSafeBrowsing { get; init; } = new();
    public SpamHausDblSettings SpamHausDbl { get; init; } = new();
    public SurblSettings Surbl { get; init; } = new();
}
