using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Repositories;

public interface IDomainSafetyRepository : IBaseRepository<DomainSafety>
{
    Task<DomainSafety?> GetByDomainNameAsync(string domainName, CancellationToken cancellationToken = default);
}
