using UrlShorter.Domain.Enums;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public record GetOriginalUrlResponse(
    string OriginalUrl, 
    bool RequiresInterstitial,
    InterstitialReason InterstitialReason = InterstitialReason.None);
