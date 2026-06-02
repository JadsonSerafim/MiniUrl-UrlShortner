using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Infrastructure.Services;

public class DomainSafetyService : IDomainSafetyService
{
    private readonly IDomainSafetyRepository _domainSafetyRepository;
    private readonly IWhoisService _whoisService;
    private readonly IUnitOfWork _unitOfWork;

    public DomainSafetyService(
        IDomainSafetyRepository domainSafetyRepository, 
        IWhoisService whoisService, 
        IUnitOfWork unitOfWork)
    {
        _domainSafetyRepository = domainSafetyRepository;
        _whoisService = whoisService;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> IsDomainTooYoungAsync(string url, CancellationToken cancellationToken = default)
    {
        var domain = GetDomain(url);
        if (domain == null) return false;

        var domainSafety = await GetOrCreateDomainSafetyAsync(domain, cancellationToken);
        if (domainSafety == null) return false; // Se não conseguir verificar, falha por segurança ou permite? 
                                                // O usuário disse: "vou usar a API... se for menor do que 30 dias não vou deixar encurtar".
                                                // Se a API falhar, talvez devamos permitir ou bloquear. Por enquanto, assumimos que permite.

        return domainSafety.GetDomainAgeInDays() < 30;
    }

    public async Task<bool> ShouldShowInterstitialAsync(string url, bool isGuest, CancellationToken cancellationToken = default)
    {
        if (isGuest) return true;

        var domain = GetDomain(url);
        if (domain == null) return false;

        var domainSafety = await GetOrCreateDomainSafetyAsync(domain, cancellationToken);
        if (domainSafety == null) return false;

        return domainSafety.GetDomainAgeInDays() < 90;
    }

    private async Task<DomainSafety?> GetOrCreateDomainSafetyAsync(string domain, CancellationToken cancellationToken)
    {
        var existing = await _domainSafetyRepository.GetByDomainNameAsync(domain, cancellationToken);
        if (existing != null)
        {
            return existing;
        }

        var creationDate = await _whoisService.GetDomainCreationDateAsync(domain, cancellationToken);
        if (creationDate == null) return null;

        var newDomainSafety = DomainSafety.Create(domain, creationDate.Value);
        await _domainSafetyRepository.AddAsync(newDomainSafety, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return newDomainSafety;
    }

    private string? GetDomain(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return null;
        var host = uri.Host;
        if (host.StartsWith("www.", StringComparison.OrdinalIgnoreCase))
            host = host[4..];
        return host;
    }
}
