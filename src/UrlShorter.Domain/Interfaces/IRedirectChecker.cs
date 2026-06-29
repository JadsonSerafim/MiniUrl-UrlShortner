namespace UrlShorter.Domain.Interfaces;

public interface IRedirectChecker
{
    Task<RedirectCheckResult> CheckRedirectChainAsync(string url, CancellationToken cancellationToken = default);
}

public sealed record RedirectCheckResult
{
    public bool IsRedirect { get; init; }
    public string? TargetUrl { get; init; }
    public int StatusCode { get; init; }

    public static RedirectCheckResult Redirect(string targetUrl, int statusCode) =>
        new() { IsRedirect = true, TargetUrl = targetUrl, StatusCode = statusCode };

    public static RedirectCheckResult NotRedirect() =>
        new() { IsRedirect = false };
}
