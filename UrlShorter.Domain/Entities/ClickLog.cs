using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Domain.Entities;

public sealed class ClickLog : Entity
{
    public string ShortCode { get; private set; }
    public IpAddress IpAddress { get; private set; }
    public string? UserAgent { get; private set; }

    private ClickLog() { }

    private ClickLog(string shortCode, IpAddress ipAddress, string? userAgent) : base()
    {
        ShortCode = shortCode;
        IpAddress = ipAddress;
        UserAgent = userAgent;
    }

    public static ClickLog Create(string shortCode, IpAddress ipAddress, string? userAgent)
    {
        return new ClickLog(shortCode, ipAddress, userAgent);
    }
}
