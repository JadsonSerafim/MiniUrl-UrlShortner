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
using UrlShorter.Infrastructure.Services.UrlSafety;

namespace UrlShorter.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailSettings>(configuration.GetSection(EmailSettings.SectionName));

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");

            options.InstanceName = "UrlShorter_";
        });

        services.AddScoped<ICacheService, RedisCacheService>();
        services.AddScoped<IShortenedUrlRepository, ShortenedUrlRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IClickLogRepository, ClickLogRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IShortCodeGenerator, ShortCodeGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenProvider, TokenProvider>();
        services.AddScoped<IEmailService, EmailService>();

        services.Configure<UrlSafetySettings>(configuration.GetSection(UrlSafetySettings.SectionName));

        services.AddHttpClient("GoogleSafeBrowsing", client =>
        {
            client.BaseAddress = new Uri("https://safebrowsing.googleapis.com/");
        });

        services.AddScoped<IDnsResolver, DnsResolver>();
        services.AddScoped<IUrlSafetyChecker, GoogleSafeBrowsingChecker>();
        services.AddScoped<IUrlSafetyChecker, SpamHausDblChecker>();
        services.AddScoped<IUrlSafetyChecker, SurblChecker>();
        services.AddScoped<IUrlSafetyService, UrlSafetyService>();

        services.AddHostedService<ClickLogBackgroundServiceBatched>();
        
        var sqlitePath = configuration["FallbackSqlitePath"] ?? "Data Source=fallback_clicks.db";
        services.AddSingleton(new ClickLogFallbackRepository(sqlitePath));

        services.AddHealthChecks()
            .AddNpgSql(configuration.GetConnectionString("DefaultConnection")!)
            .AddRedis(configuration.GetConnectionString("Redis")!);

        return services;
    }
}