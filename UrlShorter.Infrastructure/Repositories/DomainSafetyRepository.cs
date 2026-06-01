using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Repositories;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class DomainSafetyRepository : BaseRepository<DomainSafety>, IDomainSafetyRepository
{
    public DomainSafetyRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<DomainSafety?> GetByDomainNameAsync(string domainName, CancellationToken cancellationToken = default)
    {
        return await _context.Set<DomainSafety>().FirstOrDefaultAsync(d => d.DomainName == domainName.ToLowerInvariant(), cancellationToken);
    }
}
