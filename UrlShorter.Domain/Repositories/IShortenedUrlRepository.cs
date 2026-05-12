using UrlShorter.Domain.Entities;

namespace UrlShorter.Domain.Interfaces;

public interface IShortenedUrlRepository
{
    Task<ShortenedUrl?> GetByIdAsync(Guid id);
    Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode);
    Task<bool> ShortCodeExistsAsync(string shortCode);
}