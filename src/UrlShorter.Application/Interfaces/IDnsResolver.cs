using System.Net;

namespace UrlShorter.Application.Interfaces;

public interface IDnsResolver
{
    Task<IPAddress[]> GetHostAddressesAsync(string hostNameOrAddress, CancellationToken cancellationToken = default);
}
