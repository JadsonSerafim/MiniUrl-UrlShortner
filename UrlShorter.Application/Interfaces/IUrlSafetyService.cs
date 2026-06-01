using UrlShorter.Domain.Enums;

namespace UrlShorter.Application.Interfaces;

public interface IUrlSafetyService
{
    /// <summary>
    /// Checks the URL against all registered safety checkers.
    /// Returns Safe if all checkers pass, Danger if any checker flags the URL, Pending if all checkers failed/errored.
    /// </summary>
    Task<UrlSafetyStatus> CheckUrlSafetyAsync(string url, CancellationToken cancellationToken = default);
}
