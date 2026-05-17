using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Repositories;

public interface IShortenedUrlRepository : IBaseRepository<ShortenedUrl>
{
    Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode);
    Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken cancellationToken);
}