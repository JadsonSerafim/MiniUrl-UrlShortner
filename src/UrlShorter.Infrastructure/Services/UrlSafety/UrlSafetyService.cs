using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Enums;

namespace UrlShorter.Infrastructure.Services.UrlSafety;

public class UrlSafetyService : IUrlSafetyService
{
    private readonly IEnumerable<IUrlSafetyChecker> _checkers;
    private readonly IOptions<UrlSafetySettings> _settings;
    private readonly ILogger<UrlSafetyService> _logger;

    public UrlSafetyService(
        IEnumerable<IUrlSafetyChecker> checkers,
        IOptions<UrlSafetySettings> settings,
        ILogger<UrlSafetyService> logger)
    {
        _checkers = checkers;
        _settings = settings;
        _logger = logger;
    }

    public async Task<UrlSafetyStatus> CheckUrlSafetyAsync(string url, CancellationToken cancellationToken = default)
    {
        if (!_settings.Value.Enabled)
        {
            _logger.LogInformation("A verificação de segurança de URL está desativada globalmente, permitindo a URL: {Url}", url);
            return UrlSafetyStatus.Safe;
        }

        var enabledCheckers = _checkers.Where(c => IsCheckerEnabled(c.Name)).ToList();

        if (enabledCheckers.Count == 0)
        {
            _logger.LogDebug("Nenhum verificador de segurança de URL está ativado, permitindo a URL: {Url}", url);
            return UrlSafetyStatus.Safe;
        }

        var timeout = TimeSpan.FromSeconds(_settings.Value.CheckTimeoutSeconds);

        var tasks = enabledCheckers.Select(checker => RunCheckerWithTimeoutAsync(checker, url, timeout, cancellationToken));
        var results = await Task.WhenAll(tasks);

        var hasUnsafe = false;
        var hasSafe = false;

        foreach (var (checkerName, result) in results)
        {
            if (result is null)
            {
                // Checker failed or timed out — treated as inconclusive
                _logger.LogWarning("O verificador {CheckerName} falhou ou excedeu o tempo limite para a URL {Url}", checkerName, url);
                continue;
            }

            if (!result.IsSafe)
            {
                hasUnsafe = true;
                _logger.LogWarning("URL {Url} sinalizada por {CheckerName}: {Reason}", url, checkerName, result.Reason);
            }
            else
            {
                hasSafe = true;
            }
        }

        if (hasUnsafe)
        {
            return UrlSafetyStatus.Danger;
        }

        if (hasSafe)
        {
            return UrlSafetyStatus.Safe;
        }

        _logger.LogWarning("Todos os verificadores de segurança de URL falharam ou excederam o tempo limite para a URL {Url}, marcando como Pendente", url);
        return UrlSafetyStatus.Pending;
    }

    private async Task<(string CheckerName, UrlSafetyCheckResult? Result)> RunCheckerWithTimeoutAsync(
        IUrlSafetyChecker checker,
        string url,
        TimeSpan timeout,
        CancellationToken cancellationToken)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        cts.CancelAfter(timeout);

        try
        {
            var result = await checker.CheckAsync(url, cts.Token);
            return (checker.Name, result);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogWarning("O verificador {CheckerName} excedeu o tempo limite após {TimeoutSeconds}s para a URL {Url}",
                checker.Name, timeout.TotalSeconds, url);
            return (checker.Name, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "O verificador {CheckerName} lançou uma exceção não tratada para a URL {Url}",
                checker.Name, url);
            return (checker.Name, null);
        }
    }

    private bool IsCheckerEnabled(string checkerName)
    {
        return checkerName switch
        {
            "GoogleSafeBrowsing" => _settings.Value.GoogleSafeBrowsing.Enabled,
            "SpamHausDBL" => _settings.Value.SpamHausDbl.Enabled,
            "SURBL" => _settings.Value.Surbl.Enabled,
            _ => true 
        };
    }
}
