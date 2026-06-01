namespace UrlShorter.Application.Interfaces;

public sealed record UrlSafetyCheckResult(bool IsSafe, string? Reason = null)
{
    public static readonly UrlSafetyCheckResult Safe = new(true);
    public static UrlSafetyCheckResult Unsafe(string reason) => new(false, reason);
}

public interface IUrlSafetyChecker
{
    string Name { get; }
    Task<UrlSafetyCheckResult> CheckAsync(string url, CancellationToken cancellationToken = default);
}
