using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;
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

    public Task<List<ShortenedUrl>> GetAllUserUrlsAsync(Guid userId, CancellationToken cancellationToken)
    {
        return _context.ShortenedUrls
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

public Task<ShortenedUrl?> GetActiveGuestUrlAsync(string originalUrl, CancellationToken cancellationToken)
{
    var urlResult = Url.Create(originalUrl);
    if (urlResult.IsFailure) return Task.FromResult<ShortenedUrl?>(null);

    var url = urlResult.Value;

    return _context.ShortenedUrls
        .AsNoTracking()
        .FirstOrDefaultAsync(x =>
            !x.UserId.HasValue &&
            x.OriginalUrl == url &&
            x.IsActive &&
            (!x.ExpiresAt.HasValue || x.ExpiresAt.Value > DateTime.UtcNow),
            cancellationToken);
}

    public Task<int> CountActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return _context.ShortenedUrls
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.IsActive)
            .CountAsync(cancellationToken);
    }
}