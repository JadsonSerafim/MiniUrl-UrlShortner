using System.Net;
using System.Net.Sockets;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class SurblChecker : IUrlSafetyChecker
{
    private readonly IDnsResolver _dnsResolver;
    private readonly IOptions<UrlSafetySettings> _settings;
    private readonly ILogger<SurblChecker> _logger;

    public string Name => "SURBL";

    public SurblChecker(IDnsResolver dnsResolver, IOptions<UrlSafetySettings> settings, ILogger<SurblChecker> logger)
    {
        _dnsResolver = dnsResolver;
        _settings = settings;
        _logger = logger;
    }

    public async Task<UrlSafetyCheckResult> CheckAsync(string url, CancellationToken cancellationToken = default)
    {
        if (!_settings.Value.Surbl.Enabled)
        {
            _logger.LogDebug("O verificador SURBL está desativado, pulando");
            return UrlSafetyCheckResult.Safe;
        }

        var domain = ExtractDomain(url);
        if (domain is null)
        {
            _logger.LogDebug("Não foi possível extrair o domínio da URL: {Url}", url);
            return UrlSafetyCheckResult.Safe;
        }

        var queryHost = $"{domain}.multi.surbl.org";

        try
        {
            var addresses = await _dnsResolver.GetHostAddressesAsync(queryHost, cancellationToken);

            foreach (var ip in addresses)
            {
                if (IsInSurblRange(ip))
                {
                    _logger.LogWarning("O SURBL sinalizou a URL {Url} (domínio: {Domain}) como maliciosa, IP: {Ip}",
                        url, domain, ip);
                    return UrlSafetyCheckResult.Unsafe($"SURBL listed domain: {domain}");
                }
            }

            _logger.LogDebug("SURBL: o domínio {Domain} não está listado", domain);
            return UrlSafetyCheckResult.Safe;
        }
        catch (SocketException)
        {
            _logger.LogTrace("SURBL: o domínio {Domain} retornou NXDOMAIN (não listado)", domain);
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

    private static bool IsInSurblRange(IPAddress ip)
    {
        var bytes = ip.GetAddressBytes();
        return bytes.Length == 4
               && bytes[0] == 127
               && bytes[1] == 0
               && bytes[2] == 0;
    }
}
