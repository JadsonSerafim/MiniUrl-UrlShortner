using UrlShorter.Domain.Common;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Domain.Entities;

public class ShortenedUrl : Entity
{
    public Url OriginalUrl { get; private set; }
    public string ShortCode { get; private set; }
    public int ClickCount { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    
    private ShortenedUrl() {}

    private ShortenedUrl(Url originalUrl, string shortCode, DateTime? expiresAt)
    {
        OriginalUrl = originalUrl;
        ShortCode = shortCode;
        ClickCount = 0;
        ExpiresAt = expiresAt;
    }

    public static Result<ShortenedUrl> Create(Url originalUrl, string shortCode, DateTime? expiresAt = null)
    {
        if (string.IsNullOrWhiteSpace(shortCode))
        {
            return ErrorsUrl.ShortCodeEmpty;
        }

        return new ShortenedUrl(originalUrl, shortCode, expiresAt);
    }

    public Result UpdateUrl(Url newUrl)
    {
        OriginalUrl = newUrl;
        Update();
        return Result.Success();
    }

    public void RegisterClick()
    {
        ClickCount++;
    }

    public bool IsExpired()
    {
        return ExpiresAt.HasValue && ExpiresAt.Value < DateTime.UtcNow;
    }
}