using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace UrlShorter.API.Middlewares;

public class GuestRateLimitMiddleware
{
    private readonly RequestDelegate _next;

    public GuestRateLimitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IMemoryCache cache)
    {
        if (context.Request.Path.Equals("/api/urls", StringComparison.OrdinalIgnoreCase) && context.Request.Method == HttpMethods.Post)
        {

            bool isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
            if (!isAuthenticated)
            {
                string clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                string cacheKey = $"rateLimit:guest:{clientIp}";

                var currentCount = cache.GetOrCreate(cacheKey, entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2);
                    return new RateLimitCounter
                    {
                        Count = 0,
                        ExpiresAt = DateTime.UtcNow.AddMinutes(2)
                    };
                });
                    if (currentCount!.Count >= 5)
                    {
                        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                        context.Response.ContentType = "application/json";
                        var errorResponse = new
                        {
                            Code = "RateLimit.Exceeded",
                            Description = "Muitas requisições, tente novamente em 2 minutos",
                            Type = 1
                        };
                        await context.Response.WriteAsJsonAsync(errorResponse);
                        return;
                    }

                currentCount.Count++;
            }
        }
        await _next(context);
    }
}

internal class RateLimitCounter
{
    public int Count { get; set; }
    public DateTime ExpiresAt { get; init; }
}