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

    private static readonly HashSet<string> DefaultBlockedShorteners = new(StringComparer.OrdinalIgnoreCase)
    {
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
        "buff.ly", "cutt.ly", "rebrand.ly", "shorturl.at", "rb.gy",
        "dw.gd", "v.gd", "tny.im", "tiny.cc", "clck.ru", "surl.li",
        "urlshortn.com", "shorter.me", "shorturl.do", "shorte.st",
        "shrinkme.io", "cut.ly", "bitly.com", "bl.ink",
        "wa.me", "t.me",
        "0link.co", "adf.ly", "bc.vc", "ouo.io", "tiny.pl",
        "krz.ch", "href.li",
        "jadson.dev.br"
    };

    private Url(string value) => Value = value;

    public static Result<Url> Create(string value, IEnumerable<string>? blockedShorteners = null)
    {
        if (string.IsNullOrWhiteSpace(value))
            return ErrorsUrl.Empty;

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
            return ErrorsUrl.InvalidFormat;

        if (!AllowedSchemes.Contains(uri.Scheme))
            return ErrorsUrl.HttpInvalid;

        if (IsLocalOrPrivateAddress(uri.Host))
            return ErrorsUrl.RestrictedTarget;

        if (HasMaliciousTld(uri.Host))
            return ErrorsUrl.MaliciousTld;

        if (IsBlockedShortener(uri.Host, blockedShorteners))
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

            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                byte[] bytes = ip.GetAddressBytes();
                if (bytes[0] == 10) return true;
                if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;
                if (bytes[0] == 192 && bytes[1] == 168) return true;
            }

            if (ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal) return true;
        }

        return false;
    }

    private static bool HasMaliciousTld(string host)
    {
        return MaliciousTlds.Any(tld => host.EndsWith(tld, StringComparison.OrdinalIgnoreCase));
    }

    private static bool IsBlockedShortener(string host, IEnumerable<string>? blockedShorteners)
    {
        var cleanHost = host.StartsWith("www.", StringComparison.OrdinalIgnoreCase)
            ? host[4..]
            : host;

        var shorteners = blockedShorteners?.Any() == true
            ? new HashSet<string>(blockedShorteners, StringComparer.OrdinalIgnoreCase)
            : DefaultBlockedShorteners;

        if (shorteners.Contains(cleanHost))
            return true;

        return shorteners.Any(blocked =>
            cleanHost.EndsWith("." + blocked, StringComparison.OrdinalIgnoreCase));
    }

    public static implicit operator string(Url url) => url.Value;
}
