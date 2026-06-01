using UrlShorter.Domain.Enums;

namespace UrlShorter.Application.Interfaces;

public interface IUrlSafetyService
{
    Task<UrlSafetyStatus> CheckUrlSafetyAsync(string url, CancellationToken cancellationToken = default);
}
