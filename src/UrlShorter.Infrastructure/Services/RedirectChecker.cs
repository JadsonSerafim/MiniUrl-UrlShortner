using System.Net;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Infrastructure.Services;

public class RedirectChecker : IRedirectChecker
{
    private readonly IHttpClientFactory _httpClientFactory;

    public RedirectChecker(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<RedirectCheckResult> CheckRedirectChainAsync(string url, CancellationToken cancellationToken = default)
    {
        try
        {
            using var client = _httpClientFactory.CreateClient("RedirectChecker");
            using var request = new HttpRequestMessage(HttpMethod.Head, url);
            request.Headers.Add("User-Agent", "UrlShorter-SafetyCheck/1.0");

            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            if (IsRedirect(response.StatusCode))
            {
                var location = response.Headers.Location?.ToString();
                return RedirectCheckResult.Redirect(location ?? url, (int)response.StatusCode);
            }

            return RedirectCheckResult.NotRedirect();
        }
        catch (HttpRequestException)
        {
            return RedirectCheckResult.NotRedirect();
        }
        catch (TaskCanceledException)
        {
            return RedirectCheckResult.NotRedirect();
        }
    }

    private static bool IsRedirect(HttpStatusCode statusCode)
    {
        return statusCode is
            HttpStatusCode.MovedPermanently or      // 301
            HttpStatusCode.Found or                 // 302
            HttpStatusCode.SeeOther or              // 303
            HttpStatusCode.TemporaryRedirect or     // 307
            (HttpStatusCode)308;                    // 308
    }
}
