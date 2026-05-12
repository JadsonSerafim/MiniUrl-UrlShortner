using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public abstract class BaseRepository<T> : IBaseRepository<T> where T : Entity
{
    
    protected readonly AppDbContext _context;

    protected BaseRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<T> AddAsync(T entity)
    {
         await _context.Set<T>().AddAsync(entity);
         return entity;

    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _context.Set<T>().FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
    }

    public async Task UpdateAsync(T entity)
    {
          _context.Update(entity);
    }

    public Task DeleteAsync(T entity)
    {
        entity.Deactivate();
        return Task.CompletedTask;
    }
}