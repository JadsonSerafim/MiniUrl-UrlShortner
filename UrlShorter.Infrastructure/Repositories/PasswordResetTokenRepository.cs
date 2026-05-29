using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Repositories;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly AppDbContext _context;

    public PasswordResetTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task AddAsync(PasswordResetToken token)
    {
        _context.PasswordResetTokens.AddAsync(token);
        return Task.CompletedTask;
    }

    public Task<PasswordResetToken?> GetActiveByCodeAsync(string code, Guid userId)
    {
         return _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.Code == code && 
                                     t.UserId == userId && 
                                     !t.IsUsed &&
                                     t.ExpiresAt > DateTime.UtcNow);
    
    }

    public Task InvalidateAllForUserAsync(Guid userId)
    {
         _context.PasswordResetTokens
            .Where(t => t.UserId == userId && !t.IsUsed)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsUsed, true));
        return Task.CompletedTask;
    }
}
