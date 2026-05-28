using UrlShorter.Domain.Entities;

namespace UrlShorter.Domain.Repositories;

public interface IPasswordResetTokenRepository
{
    Task AddAsync(PasswordResetToken token);
    Task<PasswordResetToken?> GetActiveByCodeAsync(string code, Guid userId);
    Task InvalidateAllForUserAsync(Guid userId);
}
