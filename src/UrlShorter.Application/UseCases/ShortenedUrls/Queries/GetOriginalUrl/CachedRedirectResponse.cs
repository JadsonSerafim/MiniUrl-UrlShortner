using UrlShorter.Domain.Enums;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public record CachedRedirectResponse(
    string OriginalUrl,
    bool RequiresInterstitial,
    InterstitialReason InterstitialReason,
    UrlSafetyStatus SafetyStatus);
