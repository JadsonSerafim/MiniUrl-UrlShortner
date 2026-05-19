using System.Net;
using System.Net.Sockets;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Domain.ValueObjects;

public sealed record IpAddress
{
    public string Value { get; }

    private IpAddress(string value)
    {
        Value = value;
    }

    public static Result<IpAddress> Create(string? rawIp)
    {
        if (string.IsNullOrWhiteSpace(rawIp))
        {
            return ErrorsIpAddress.IpAddressEmpty;
        }

        string anonymizedIp = Anonymize(rawIp);

        return new IpAddress(anonymizedIp);
    }

    private static string Anonymize(string ip)
    {
        if (!IPAddress.TryParse(ip, out var ipAddress))
        {
            return ip;
        }

    if (ipAddress.AddressFamily == AddressFamily.InterNetwork)
    {
        var bytes = ipAddress.GetAddressBytes();
        bytes[3] = 0;
        return new IPAddress(bytes).ToString();
    }

    if (ipAddress.AddressFamily == AddressFamily.InterNetworkV6)
    {
        var bytes = ipAddress.GetAddressBytes();
        for (int i = 8; i < 16; i++)
        {
            bytes[i] = 0;
        }
        return new IPAddress(bytes).ToString();
    }

    return ip;
}

}
