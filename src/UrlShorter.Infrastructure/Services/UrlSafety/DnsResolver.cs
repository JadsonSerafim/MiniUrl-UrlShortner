using System.Net;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class DnsResolver : IDnsResolver
{
    public async Task<IPAddress[]> GetHostAddressesAsync(string hostNameOrAddress, CancellationToken cancellationToken = default)
    {
        return await Dns.GetHostAddressesAsync(hostNameOrAddress, cancellationToken);
    }
}
