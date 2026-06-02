using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    
    private readonly AppDbContext _context;
    
    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }
    public async Task<int> SaveChangesAsync(CancellationToken CancellationToken = default)
    {
    return await _context.SaveChangesAsync(CancellationToken);
    }
}