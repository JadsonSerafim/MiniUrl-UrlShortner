using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{

    public UserRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.Users.AnyAsync(x => x.Id == id, cancellationToken);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return _context.Users.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<bool> IsEmailUniqueAsync(string email, CancellationToken cancellationToken = default)
    {
        return !await _context.Users.AnyAsync(x => x.Email == email, cancellationToken);
    }
}
