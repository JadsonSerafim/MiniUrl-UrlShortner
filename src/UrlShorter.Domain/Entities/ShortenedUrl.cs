using UrlShorter.Domain.Common;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Domain.Entities;

public class ShortenedUrl : Entity
{
    public string? Name { get; private set; }
    public Url OriginalUrl { get; private set; }
    public string ShortCode { get; private set; }
    public int ClickCount { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public Guid? UserId { get; private set; }
    public UrlSafetyStatus SafetyStatus { get; private set; }

    private ShortenedUrl()
    {
        OriginalUrl = null!;
        ShortCode = null!;
    }

    private ShortenedUrl(Url originalUrl, string shortCode, Guid? userId, DateTime? expiresAt, string? name, UrlSafetyStatus safetyStatus)
    {
        Name = name;
        OriginalUrl = originalUrl;
        ShortCode = shortCode;
        UserId = userId;
        ClickCount = 0;
        ExpiresAt = expiresAt;
        SafetyStatus = safetyStatus;
    }

    public static Result<ShortenedUrl> Create(Url originalUrl, string shortCode, Guid? userId = null, DateTime? expiresAt = null, int currentUserUrlsCount = 0
    , string? name = null, UrlSafetyStatus safetyStatus = UrlSafetyStatus.Safe)
    {
        if (string.IsNullOrWhiteSpace(shortCode))
        {
            return ErrorsUrl.ShortCodeEmpty;
        }

        var creationTime = DateTime.UtcNow;

        if (expiresAt is null)
        {
            expiresAt = creationTime.AddDays(1);
        }

        if (userId is null)
        {
            expiresAt = creationTime.AddDays(1).AddMinutes(2);
        }

        if (expiresAt > creationTime.AddYears(1))
        {
            return ErrorsUrl.ExtensionExceedsLimit;
        }

        if (userId is not null && currentUserUrlsCount >= 1000)
        {
            return ErrorsUrl.UserUrlLimitExceeded;
        }

        if(name is not null && name.Length > 30)
        {
            return ErrorsUrl.InvalidName;
        }

        return new ShortenedUrl(originalUrl, shortCode, userId, expiresAt, name, safetyStatus);
    }

    public void UpdateSafetyStatus(UrlSafetyStatus status)
    {
        SafetyStatus = status;
        Update();
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
    
    public Result ExtendExpiration(int quantity, string unit)
    {
        if (quantity <= 0)
            return ErrorsUrl.InvalidExtensionQuantity;

        var now = DateTime.UtcNow;
        var maxExpiration = now.AddYears(1);

        var baseDate = ExpiresAt.HasValue && ExpiresAt.Value > now ? ExpiresAt.Value : now;

        var newExpiration = unit.ToLower() switch
        {
            "days" => baseDate.AddDays(quantity),
            "months" => baseDate.AddMonths(quantity),
            _ => baseDate.AddDays(quantity)
        };

        if (newExpiration > maxExpiration)
        {
            return ErrorsUrl.ExtensionExceedsLimit;
        }

        ExpiresAt = newExpiration;
        Update();
        return Result.Success();
    }
}