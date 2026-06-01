using System.Net;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Domain.ValueObjects;

public sealed record Url
{
    public string Value { get; }

    private static readonly string[] AllowedSchemes = { "https", "http" };

    private static readonly HashSet<string> MaliciousTlds = new(StringComparer.OrdinalIgnoreCase)
    {
        ".tk", ".ml", ".ga", ".cf", ".gq", ".pw", ".top", ".xyz", ".zip", ".mov"
    };

    private static readonly HashSet<string> BlockedShorteners = new(StringComparer.OrdinalIgnoreCase)
    {
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "jadson.dev.br"
    };

    private Url(string value) => Value = value;

    public static Result<Url> Create(string value)
    {
        // 1. Validação de Formato
        if (string.IsNullOrWhiteSpace(value))
            return ErrorsUrl.Empty;

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
            return ErrorsUrl.InvalidFormat;

        if (!AllowedSchemes.Contains(uri.Scheme))
            return ErrorsUrl.HttpInvalid;

        // 2. Prevenção de SSRF (Rede Local)
        if (IsLocalOrPrivateAddress(uri.Host))
            return ErrorsUrl.RestrictedTarget;

        // 3. Bloqueio de TLDs Maliciosos
        if (HasMaliciousTld(uri.Host))
            return ErrorsUrl.MaliciousTld;

        // 4. Prevenção de Chain Redirect e Loop
        if (IsBlockedShortener(uri.Host))
            return ErrorsUrl.ChainRedirectForbidden;

        return new Url(value);
    }

    private static bool IsLocalOrPrivateAddress(string host)
    {
        if (string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase))
            return true;

        if (IPAddress.TryParse(host, out var ip))
        {
            if (IPAddress.IsLoopback(ip)) return true;

            // Check private IPv4 ranges
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                byte[] bytes = ip.GetAddressBytes();
                // 10.0.0.0/8
                if (bytes[0] == 10) return true;
                // 172.16.0.0/12
                if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;
                // 192.168.0.0/16
                if (bytes[0] == 192 && bytes[1] == 168) return true;
            }
            
            // IPv6 Link-local / Unique-local
            if (ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal) return true;
        }

        return false;
    }

    private static bool HasMaliciousTld(string host)
    {
        return MaliciousTlds.Any(tld => host.EndsWith(tld, StringComparison.OrdinalIgnoreCase));
    }

    private static bool IsBlockedShortener(string host)
    {
        var cleanHost = host.StartsWith("www.", StringComparison.OrdinalIgnoreCase) 
            ? host[4..] 
            : host;

        return BlockedShorteners.Contains(cleanHost);
    }

    public static implicit operator string(Url url) => url.Value;
}
