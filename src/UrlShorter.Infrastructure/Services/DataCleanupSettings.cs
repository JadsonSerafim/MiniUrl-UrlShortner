namespace UrlShorter.Infrastructure.Services;

public class DataCleanupSettings
{
    public const string SectionName = "DataCleanup";

    public int ClickLogRetentionDays { get; set; } = 365;
    public int ExpiredUrlRetentionDays { get; set; } = 30;
}
