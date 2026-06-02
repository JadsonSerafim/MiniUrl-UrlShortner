namespace UrlShorter.Application.Interfaces;

public interface IDomainSafetyService
{
    /// <summary>
    /// Checks if a domain is too young to be shortened (< 30 days).
    /// </summary>
    Task<bool> IsDomainTooYoungAsync(string url, CancellationToken cancellationToken = default);

    /// <summary>
    /// Determines if an interstitial page should be shown before redirecting.
    /// Criteria: Guest URL OR Domain age < 90 days.
    /// </summary>
    Task<bool> ShouldShowInterstitialAsync(string url, bool isGuest, CancellationToken cancellationToken = default);
}
