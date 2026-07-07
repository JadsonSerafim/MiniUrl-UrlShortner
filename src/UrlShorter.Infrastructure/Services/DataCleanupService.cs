using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Services;

public class DataCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DataCleanupService> _logger;
    private readonly DataCleanupSettings _settings;

    private static readonly TimeSpan CleanupInterval = TimeSpan.FromHours(24);

    public DataCleanupService(
        IServiceScopeFactory scopeFactory,
        ILogger<DataCleanupService> logger,
        IOptions<DataCleanupSettings> settings)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _settings = settings.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(CleanupInterval, stoppingToken);
                await CleanupOldDataAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no servico de limpeza de dados.");
            }
        }
    }

    private async Task CleanupOldDataAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var clickLogCutoff = DateTime.UtcNow.AddDays(-_settings.ClickLogRetentionDays);
        var deletedClickLogs = await dbContext.ClickLogs
            .Where(cl => cl.CreatedAt < clickLogCutoff)
            .ExecuteDeleteAsync(cancellationToken);

        _logger.LogInformation("Removidos {Count} registros de clique antigos (anteriores a {Cutoff}).",
            deletedClickLogs, clickLogCutoff);

        var urlCutoff = DateTime.UtcNow.AddDays(-_settings.ExpiredUrlRetentionDays);
        var deletedUrls = await dbContext.ShortenedUrls
            .Where(u => !u.IsActive && u.ExpiresAt < urlCutoff)
            .ExecuteDeleteAsync(cancellationToken);

        _logger.LogInformation("Removidos {Count} registros de URL expirada (anteriores a {Cutoff}).",
            deletedUrls, urlCutoff);
    }
}
