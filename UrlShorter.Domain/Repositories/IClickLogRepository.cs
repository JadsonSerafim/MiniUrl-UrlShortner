using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Repositories;

public interface IClickLogRepository : IBaseRepository<ClickLog>
{
    Task<List<ClickLog>> GetByShortCodeAsync(string shortCode, CancellationToken cancellationToken = default);
}
