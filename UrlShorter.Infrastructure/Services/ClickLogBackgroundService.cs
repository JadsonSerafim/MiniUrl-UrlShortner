using System.Threading.Channels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;
using UrlShorter.Infrastructure.Persistence;
using UrlShorter.Infrastructure.Repositories;

namespace UrlShorter.Infrastructure.Services;

public class ClickLogBackgroundServiceBatched : BackgroundService
{
    private readonly ChannelReader<ClickEvent> _channelReader;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ClickLogBackgroundServiceBatched> _logger;
    private readonly ClickLogFallbackRepository _fallbackRepository;


    private const int BatchSize = 100;
    private const int BatchTimeoutMs = 5000;

    public ClickLogBackgroundServiceBatched(
        ChannelReader<ClickEvent> channelReader,
        IServiceScopeFactory scopeFactory,
        ILogger<ClickLogBackgroundServiceBatched> logger,
        ClickLogFallbackRepository fallbackRepository)
    {
        _channelReader = channelReader;
        _scopeFactory = scopeFactory;
        _logger = logger;
        _fallbackRepository = fallbackRepository;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            var fallbackClicks = await _fallbackRepository.GetAllAndClearAsync();
            var list = fallbackClicks.ToList();

            if (list.Count > 0)
            {
                await ProcessBatchWithFallbackAsync(list, stoppingToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar cliques de fallback na inicialização.");
        }


        var batch = new List<ClickEvent>(BatchSize);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var hasItems = await _channelReader.WaitToReadAsync(stoppingToken);

                if (!hasItems)
                    break;

                while (batch.Count < BatchSize && _channelReader.TryRead(out var item))
                {
                    batch.Add(item);
                }

                if (batch.Count >= BatchSize)
                {
                    await ProcessBatchWithFallbackAsync(batch, stoppingToken);
                    batch.Clear();
                    continue;
                }

                if (batch.Count > 0)
                {
                    await Task.Delay(BatchTimeoutMs, stoppingToken);

                    if (batch.Count > 0)
                    {
                        await ProcessBatchWithFallbackAsync(batch, stoppingToken);
                        batch.Clear();
                    }
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("ClickLog Background Service (batched) cancelado. Processando cliques restantes...");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no loop principal do ClickLog Background Service");
            }
        }

        var remainingClicks = DrainChannel();
        if (remainingClicks.Count > 0)
        {
            batch.AddRange(remainingClicks);
        }

        if (batch.Count > 0)
        {
            _logger.LogInformation("Salvando {Count} cliques pendentes no banco principal ou fallback durante o desligamento...", batch.Count);
            await ProcessBatchWithFallbackAsync(batch, CancellationToken.None);
            batch.Clear();
        }

        _logger.LogInformation("ClickLog Background Service (batched) encerrado.");
    }

    private List<ClickEvent> DrainChannel()
    {
        var list = new List<ClickEvent>();
        while (_channelReader.TryRead(out var item))
        {
            list.Add(item);
        }
        return list;
    }

    private async Task ProcessBatchWithFallbackAsync(List<ClickEvent> batch, CancellationToken ct)
    {
        if (batch.Count == 0) return;

        var savedToDb = await TrySaveToMainDatabaseAsync(batch, ct);
        if (!savedToDb)
        {
            await TrySaveToFallbackAsync(batch);
        }
    }

    private async Task<bool> TrySaveToMainDatabaseAsync(List<ClickEvent> batch, CancellationToken ct)
    {
        try
        {
            await ProcessBatchAsync(batch, ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao salvar lote de cliques no banco principal.");
            return false;
        }
    }

    private async Task<bool> TrySaveToFallbackAsync(List<ClickEvent> batch)
    {
        try
        {
            await _fallbackRepository.SaveRangeAsync(batch);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "FALHA CRÍTICA: Não foi possível salvar os cliques no fallback SQLite!");
            return false;
        }
    }

    private async Task ProcessBatchAsync(List<ClickEvent> batch, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        foreach (var evt in batch)
        {
            var ipAddressResult = IpAddress.Create(evt.IpAddress);
            var ipAddress = ipAddressResult.IsSuccess
                ? ipAddressResult.Value
                : IpAddress.Create("0.0.0.0").Value;

            var clickLog = ClickLog.Create(evt.ShortCode, ipAddress, evt.UserAgent);
            dbContext.ClickLogs.Add(clickLog);
        }

        await dbContext.SaveChangesAsync(ct);
    }
}
