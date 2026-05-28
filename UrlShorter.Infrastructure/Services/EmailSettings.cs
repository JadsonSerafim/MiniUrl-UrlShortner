namespace UrlShorter.Infrastructure.Services;

public class EmailSettings
{
    public const string SectionName = "Email";

    public string SmtpServer { get; init; } = string.Empty;
    public int SmtpPort { get; init; }
    public string SmtpUser { get; init; } = string.Empty;
    public string SmtpPass { get; init; } = string.Empty;
    public string FromName { get; init; } = string.Empty;
    public string FromAddress { get; init; } = string.Empty;
}
