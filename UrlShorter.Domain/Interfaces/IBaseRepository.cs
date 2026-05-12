using UrlShorter.Domain.Entities;

namespace UrlShorter.Domain.Interfaces;

public interface IBaseRepository<T> where T : Entity
{
    Task<T> AddAsync(T entity);
    Task<T?> GetByIdAsync(Guid id);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}