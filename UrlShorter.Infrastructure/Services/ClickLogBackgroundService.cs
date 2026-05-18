using System.Threading.Channels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;
using UrlShorter.Infrastructure.Persistence;

namespace UrlShorter.Infrastructure.Services;

public class ClickLogBackgroundServiceBatched : BackgroundService
{
    private readonly ChannelReader<ClickEvent> _channelReader;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ClickLogBackgroundServiceBatched> _logger;


    private const int BatchSize = 100;
    private const int BatchTimeoutMs = 5000;

    public ClickLogBackgroundServiceBatched(
        ChannelReader<ClickEvent> channelReader,
        IServiceScopeFactory scopeFactory,
        ILogger<ClickLogBackgroundServiceBatched> logger)
    {
        _channelReader = channelReader;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

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
                    await ProcessBatchAsync(batch, stoppingToken);
                    batch.Clear();
                    continue;
                }

                if (batch.Count > 0)
                {
                    await Task.Delay(BatchTimeoutMs, stoppingToken);

                    if (batch.Count > 0)
                    {
                        await ProcessBatchAsync(batch, stoppingToken);
                        batch.Clear();
                    }
                }
            }
            catch (OperationCanceledException)
            {

                if (batch.Count > 0)
                {
                    await ProcessBatchAsync(batch, CancellationToken.None);
                    batch.Clear();
                }
                _logger.LogInformation("ClickLog Background Service (batched) finalizando...");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no loop principal do ClickLog Background Service");
            }
        }

        _logger.LogInformation("ClickLog Background Service (batched) encerrado.");
    }

    private async Task ProcessBatchAsync(List<ClickEvent> batch, CancellationToken ct)
    {
        if (batch.Count == 0) return;

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
