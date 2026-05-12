using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;
using UrlShorter.Infrastructure.Repositories;

namespace UrlShorter.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // TODO: registrar DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            
            options.InstanceName = "UrlShorter_";
        });

        // TODO: registrar Repositórios
        // services.AddScoped<IExampleRepository, ExampleRepository>();

        services.AddScoped<IShortenedUrlRepository, ShortenedUrlRepository>();
        
        return services;
    }
}