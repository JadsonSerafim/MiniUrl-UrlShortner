using Microsoft.Extensions.Caching.Distributed;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public Task<string?> GetAsync(string key, CancellationToken cancellationToken = default)
    {
        return _cache.GetStringAsync(key, cancellationToken);
    }

    public Task SetAsync(
        string key, 
        string value, 
        TimeSpan? expiration = null, 
        CancellationToken cancellationToken = default)
    {
        var options = new DistributedCacheEntryOptions();
        
        if (expiration.HasValue)
        {
            options.AbsoluteExpirationRelativeToNow = expiration;
        }

        return _cache.SetStringAsync(key, value, options, cancellationToken);
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        return _cache.RemoveAsync(key, cancellationToken);
    }
}
