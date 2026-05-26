using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Repositories;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class ClickLogRepository : BaseRepository<ClickLog>, IClickLogRepository
{
    public ClickLogRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    public Task<List<ClickLog>> GetByShortCodeAsync(string shortCode, CancellationToken cancellationToken = default)
    {
        return _context.ClickLogs
            .Where(x => x.ShortCode == shortCode)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
