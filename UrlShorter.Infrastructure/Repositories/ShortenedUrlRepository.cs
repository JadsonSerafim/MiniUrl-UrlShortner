using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class ShortenedUrlRepository : BaseRepository<ShortenedUrl>, IShortenedUrlRepository
{

    public ShortenedUrlRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode)
    {
        return await _context.ShortenedUrls.FirstOrDefaultAsync(x => x.ShortCode == shortCode);
    }

    public Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken cancellationToken)
    {
        return _context.ShortenedUrls.AnyAsync(x => x.ShortCode == shortCode, cancellationToken);
    }
}