using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class ShortenedUrlRepository(AppDbContext context)
    : BaseRepository<ShortenedUrl>(context), IShortenedUrlRepository
{
    public async Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode)
    {
        return await _context.ShortenedUrls.FirstOrDefaultAsync(x => x.ShortCode == shortCode);
    }

    public Task<bool> ShortCodeExistsAsync(string shortCode)
    {
        return _context.ShortenedUrls.AnyAsync(x => x.ShortCode == shortCode);
    }
}