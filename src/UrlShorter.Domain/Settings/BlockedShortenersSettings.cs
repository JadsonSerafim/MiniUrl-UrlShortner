namespace UrlShorter.Domain.Settings;

public class BlockedShortenersSettings
{
    public const string SectionName = "BlockedShorteners";

    public List<string> Domains { get; set; } = new();
}
