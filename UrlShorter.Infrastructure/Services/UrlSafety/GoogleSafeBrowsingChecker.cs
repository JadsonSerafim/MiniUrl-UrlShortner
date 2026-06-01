using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class GoogleSafeBrowsingChecker : IUrlSafetyChecker
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<UrlSafetySettings> _settings;
    private readonly ILogger<GoogleSafeBrowsingChecker> _logger;

    public string Name => "GoogleSafeBrowsing";

    private static readonly string[] ThreatTypes =
    [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION"
    ];

    private static readonly string[] PlatformTypes = ["ANY_PLATFORM"];

    public GoogleSafeBrowsingChecker(
        IHttpClientFactory httpClientFactory,
        IOptions<UrlSafetySettings> settings,
        ILogger<GoogleSafeBrowsingChecker> logger)
    {
        _httpClientFactory = httpClientFactory;
        _settings = settings;
        _logger = logger;
    }

    public async Task<UrlSafetyCheckResult> CheckAsync(string url, CancellationToken cancellationToken = default)
    {
        var gsbSettings = _settings.Value.GoogleSafeBrowsing;

        if (!gsbSettings.Enabled)
        {
            _logger.LogDebug("O verificador Google Safe Browsing está desativado, pulando");
            return UrlSafetyCheckResult.Safe;
        }

        if (string.IsNullOrWhiteSpace(gsbSettings.ApiKey))
        {
            _logger.LogWarning("A chave de API do Google Safe Browsing não está configurada, pulando verificação");
            return UrlSafetyCheckResult.Safe;
        }

        var httpClient = _httpClientFactory.CreateClient("GoogleSafeBrowsing");

        var requestBody = new GoogleSafeBrowsingRequest
        {
            Client = new ClientInfo
            {
                ClientId = "UrlShorter",
                ClientVersion = "1.0.0"
            },
            ThreatInfo = new ThreatInfo
            {
                ThreatTypes = ThreatTypes,
                PlatformTypes = PlatformTypes,
                ThreatEntryTypes = ["URL"],
                ThreatEntries = [new ThreatEntry { Url = url }]
            }
        };

        try
        {
            var response = await httpClient.PostAsJsonAsync(
                $"v4/threatMatches:find?key={gsbSettings.ApiKey}",
                requestBody,
                GoogleSafeBrowsingJsonContext.Default.GoogleSafeBrowsingRequest,
                cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "A API do Google Safe Browsing retornou status {StatusCode} para a URL {Url}",
                    (int)response.StatusCode, url);
                return UrlSafetyCheckResult.Safe;
            }

            var result = await response.Content.ReadFromJsonAsync(
                GoogleSafeBrowsingJsonContext.Default.GoogleSafeBrowsingResponse,
                cancellationToken);

            if (result?.Matches is { Length: > 0 })
            {
                var threats = string.Join(", ", result.Matches.Select(m => m.ThreatType));
                _logger.LogWarning(
                    "O Google Safe Browsing sinalizou a URL {Url} como maliciosa. Ameaças: {Threats}",
                    url, threats);
                return UrlSafetyCheckResult.Unsafe($"Google Safe Browsing threats: {threats}");
            }

            _logger.LogDebug("Google Safe Browsing: a URL {Url} é segura", url);
            return UrlSafetyCheckResult.Safe;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Falha na requisição da API do Google Safe Browsing para a URL {Url}", url);
            return UrlSafetyCheckResult.Safe;
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("A requisição da API do Google Safe Browsing excedeu o tempo limite para a URL {Url}", url);
            return UrlSafetyCheckResult.Safe;
        }
    }
}


internal class GoogleSafeBrowsingRequest
{
    [JsonPropertyName("client")]
    public ClientInfo Client { get; set; } = null!;

    [JsonPropertyName("threatInfo")]
    public ThreatInfo ThreatInfo { get; set; } = null!;
}

internal class ClientInfo
{
    [JsonPropertyName("clientId")]
    public string ClientId { get; set; } = null!;

    [JsonPropertyName("clientVersion")]
    public string ClientVersion { get; set; } = null!;
}

internal class ThreatInfo
{
    [JsonPropertyName("threatTypes")]
    public string[] ThreatTypes { get; set; } = null!;

    [JsonPropertyName("platformTypes")]
    public string[] PlatformTypes { get; set; } = null!;

    [JsonPropertyName("threatEntryTypes")]
    public string[] ThreatEntryTypes { get; set; } = null!;

    [JsonPropertyName("threatEntries")]
    public ThreatEntry[] ThreatEntries { get; set; } = null!;
}

internal class ThreatEntry
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = null!;
}

internal class GoogleSafeBrowsingResponse
{
    [JsonPropertyName("matches")]
    public ThreatMatch[]? Matches { get; set; }
}

internal class ThreatMatch
{
    [JsonPropertyName("threatType")]
    public string ThreatType { get; set; } = null!;

    [JsonPropertyName("platformType")]
    public string PlatformType { get; set; } = null!;

    [JsonPropertyName("threat")]
    public ThreatEntry? Threat { get; set; }

    [JsonPropertyName("cacheDuration")]
    public string? CacheDuration { get; set; }
}

[JsonSerializable(typeof(GoogleSafeBrowsingRequest))]
[JsonSerializable(typeof(GoogleSafeBrowsingResponse))]
internal partial class GoogleSafeBrowsingJsonContext : JsonSerializerContext
{
}
