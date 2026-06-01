using System.Net;
using System.Net.Sockets;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class SpamHausDblChecker : IUrlSafetyChecker
{
    private readonly IDnsResolver _dnsResolver;
    private readonly IOptions<UrlSafetySettings> _settings;
    private readonly ILogger<SpamHausDblChecker> _logger;

    public string Name => "SpamHausDBL";

    public SpamHausDblChecker(IDnsResolver dnsResolver, IOptions<UrlSafetySettings> settings, ILogger<SpamHausDblChecker> logger)
    {
        _dnsResolver = dnsResolver;
        _settings = settings;
        _logger = logger;
    }

    public async Task<UrlSafetyCheckResult> CheckAsync(string url, CancellationToken cancellationToken = default)
    {
        if (!_settings.Value.SpamHausDbl.Enabled)
        {
            _logger.LogDebug("O verificador SpamHaus DBL está desativado, pulando");
            return UrlSafetyCheckResult.Safe;
        }

        var domain = ExtractDomain(url);
        if (domain is null)
        {
            _logger.LogDebug("Não foi possível extrair o domínio da URL: {Url}", url);
            return UrlSafetyCheckResult.Safe;
        }

        var queryHost = $"{domain}.dbl.spamhaus.org";

        try
        {
            var addresses = await _dnsResolver.GetHostAddressesAsync(queryHost, cancellationToken);

            foreach (var ip in addresses)
            {
                if (IsInSpamHausRange(ip))
                {
                    _logger.LogWarning("O SpamHaus DBL sinalizou a URL {Url} (domínio: {Domain}) como maliciosa, IP: {Ip}",
                        url, domain, ip);
                    return UrlSafetyCheckResult.Unsafe($"SpamHaus DBL listed domain: {domain}");
                }
            }

            _logger.LogDebug("SpamHaus DBL: o domínio {Domain} não está listado", domain);
            return UrlSafetyCheckResult.Safe;
        }
        catch (SocketException)
        {
            _logger.LogTrace("SpamHaus DBL: o domínio {Domain} retornou NXDOMAIN (não listado)", domain);
            return UrlSafetyCheckResult.Safe;
        }
    }

    private static string? ExtractDomain(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return null;

        var host = uri.Host;

        if (host.StartsWith("www.", StringComparison.OrdinalIgnoreCase))
            host = host[4..];

        return host;
    }

    private static bool IsInSpamHausRange(IPAddress ip)
    {
        var bytes = ip.GetAddressBytes();
        return bytes.Length == 4
               && bytes[0] == 127
               && bytes[1] == 0
               && bytes[2] == 1;
    }
}
