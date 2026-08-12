using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Moq;
using UrlShorter.Application.Interfaces;
using UrlShorter.Infrastructure.Persistence;
using UrlShorter.Domain.Enums;

namespace UrlShorter.API.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public Mock<IDomainSafetyService> DomainSafetyMock { get; } = new();
    public Mock<IUrlSafetyService> UrlSafetyMock { get; } = new();
    public Mock<ICacheService> CacheMock { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptors = services.Where(d =>
                d.ServiceType == typeof(AppDbContext) ||
                d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                d.ServiceType.FullName?.StartsWith("Microsoft.EntityFrameworkCore") == true ||
                d.ServiceType.FullName?.Contains("StackExchange.Redis") == true ||
                d.ServiceType == typeof(IHealthCheck) ||
                d.ServiceType.FullName?.StartsWith("Microsoft.Extensions.Diagnostics.HealthChecks") == true
            ).ToList();

            foreach (var descriptor in descriptors)
            {
                services.Remove(descriptor);
            }

            // Add In-Memory DB
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase("IntegrationTestsDb");
            });

            // Replace external services with mocks
            services.RemoveAll<IDomainSafetyService>();
            services.AddScoped(_ => DomainSafetyMock.Object);

            services.RemoveAll<IUrlSafetyService>();
            services.AddScoped(_ => UrlSafetyMock.Object);

            services.RemoveAll<ICacheService>();
            services.AddScoped(_ => CacheMock.Object);

            // Ensure fresh MemoryCache for rate limiting
            services.RemoveAll<IMemoryCache>();
            services.AddMemoryCache();

            // Mock default behaviors
            UrlSafetyMock.Setup(s => s.CheckUrlSafetyAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(UrlSafetyStatus.Safe);

            DomainSafetyMock.Setup(d => d.IsDomainTooYoungAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            DomainSafetyMock.Setup(d => d.ShouldShowInterstitialAsync(It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);
        });
    }
}
