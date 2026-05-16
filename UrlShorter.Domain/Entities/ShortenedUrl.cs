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
    public Guid? UserId { get; private set; }
    
    private ShortenedUrl() {}

    private ShortenedUrl(Url originalUrl, string shortCode, Guid? userId, DateTime? expiresAt)
    {
        OriginalUrl = originalUrl;
        ShortCode = shortCode;
        UserId = userId;
        ClickCount = 0;
        ExpiresAt = expiresAt;
    }

    public static Result<ShortenedUrl> Create(Url originalUrl, string shortCode, Guid? userId = null, DateTime? expiresAt = null)
    {
        if (string.IsNullOrWhiteSpace(shortCode))
        {
            return ErrorsUrl.ShortCodeEmpty;
        }

        if (expiresAt is null)
        {
            expiresAt = DateTime.UtcNow.AddDays(1);
        }

        if (userId is null)
        {
            var maxExpiration = DateTime.UtcNow.AddDays(3).AddMinutes(2);

            if (expiresAt > maxExpiration)
            {
                return ErrorsUrl.ExpirationTooLong;
            }
        }

        return new ShortenedUrl(originalUrl, shortCode, userId, expiresAt);
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