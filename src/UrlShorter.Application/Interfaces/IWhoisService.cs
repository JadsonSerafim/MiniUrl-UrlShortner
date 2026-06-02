namespace UrlShorter.Application.Interfaces;

public interface IWhoisService
{
    Task<DateTime?> GetDomainCreationDateAsync(string domain, CancellationToken cancellationToken = default);
}
