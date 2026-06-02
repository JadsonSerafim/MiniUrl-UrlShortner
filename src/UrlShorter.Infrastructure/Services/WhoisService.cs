using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services;

public class WhoisService : IWhoisService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<WhoisSettings> _settings;
    private readonly ILogger<WhoisService> _logger;

    public WhoisService(
        IHttpClientFactory httpClientFactory, 
        IOptions<WhoisSettings> settings, 
        ILogger<WhoisService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _settings = settings;
        _logger = logger;
    }

    public async Task<DateTime?> GetDomainCreationDateAsync(string domain, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Value.ApiKey))
        {
            _logger.LogWarning("IP2WHOIS API Key is missing. Skipping WHOIS check.");
            return null;
        }

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{_settings.Value.BaseUrl}?key={_settings.Value.ApiKey}&domain={domain}";
            
            var response = await client.GetFromJsonAsync<Ip2WhoisResponse>(url, cancellationToken);

            if (response != null && !string.IsNullOrEmpty(response.CreateDate))
            {
                if (DateTime.TryParse(response.CreateDate, out var creationDate))
                {
                    return creationDate;
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling IP2WHOIS API for domain: {Domain}", domain);
            return null;
        }
    }

    private class Ip2WhoisResponse
    {
        [JsonPropertyName("create_date")]
        public string? CreateDate { get; set; }
    }
}
