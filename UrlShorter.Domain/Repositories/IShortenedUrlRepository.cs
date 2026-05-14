using UrlShorter.Domain.Entities;

namespace UrlShorter.Domain.Interfaces;

public interface IShortenedUrlRepository : IBaseRepository<ShortenedUrl>
{
    Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode);
    Task<bool> ShortCodeExistsAsync(string shortCode);
}