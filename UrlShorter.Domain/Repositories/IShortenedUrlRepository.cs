using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Repositories;

public interface IShortenedUrlRepository : IBaseRepository<ShortenedUrl>
{
    Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode);
    Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken cancellationToken);
    Task<bool> ShortCodeExistsAndActiveAsync(string shortCode, CancellationToken cancellationToken);
    Task<List<ShortenedUrl>> GetAllUserUrlsAsync(Guid userId, CancellationToken cancellationToken);
    Task<ShortenedUrl?> GetActiveGuestUrlAsync(string originalUrl, CancellationToken cancellationToken);
    Task<int> CountActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken);
}