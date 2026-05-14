using UrlShorter.Domain.Entities;

namespace UrlShorter.Domain.Interfaces;

public interface IBaseRepository<T> where T : Entity
{
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
}