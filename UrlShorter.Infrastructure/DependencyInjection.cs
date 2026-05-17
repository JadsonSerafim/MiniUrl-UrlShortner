using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Infrastructure.Persistence;
using UrlShorter.Infrastructure.Repositories;
using UrlShorter.Infrastructure.Services;
using UrlShorter.Domain.Repositories;
using UrlShorter.Application.Interfaces;
using UrlShorter.Infrastructure.Authentication;

namespace UrlShorter.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");

            options.InstanceName = "UrlShorter_";
        });

        services.AddScoped<IShortenedUrlRepository, ShortenedUrlRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IShortCodeGenerator, ShortCodeGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenProvider, TokenProvider>();


        return services;
    }
}