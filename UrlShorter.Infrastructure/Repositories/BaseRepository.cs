using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : Entity
{
    protected readonly AppDbContext _context;
    
    public BaseRepository(AppDbContext context)
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
        return await _context.Set<T>().FindAsync(id);
    }

    public Task UpdateAsync(T entity)
    {
        _context.Set<T>().Update(entity);
        return Task.CompletedTask;
        
    }

    public Task DeleteAsync(T entity)
    {
        entity.Deactivate();
        _context.Set<T>().Update(entity);
        return Task.CompletedTask;
    }
}