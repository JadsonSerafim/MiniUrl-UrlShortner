using System.Text.Json;
using System.Threading.Channels;
using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public class GetOriginalUrlHandler : IRequestHandler<GetOriginalUrlQuery, Result<GetOriginalUrlResponse>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly ChannelWriter<ClickEvent> _channelWriter;
    private readonly IUrlSafetyService _urlSafetyService;
    private readonly IDomainSafetyService _domainSafetyService;

    public GetOriginalUrlHandler(
        IShortenedUrlRepository shortenedUrlRepository,
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        ChannelWriter<ClickEvent> channelWriter,
        IUrlSafetyService urlSafetyService,
        IDomainSafetyService domainSafetyService)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _channelWriter = channelWriter;
        _urlSafetyService = urlSafetyService;
        _domainSafetyService = domainSafetyService;
    }

    public async Task<Result<GetOriginalUrlResponse>> Handle(GetOriginalUrlQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ShortCode))
        {
            return ErrorsUrl.NotFound;
        }

        var cacheKey = $"redirect:{request.ShortCode}";
        var cachedJson = await _cacheService.GetAsync(cacheKey, cancellationToken);
        if (cachedJson is not null)
        {
            var cached = JsonSerializer.Deserialize<CachedRedirectResponse>(cachedJson);
            if (cached is not null)
            {
                return new GetOriginalUrlResponse(cached.OriginalUrl, cached.RequiresInterstitial, cached.InterstitialReason);
            }
        }

        var shortenedUrl = await _shortenedUrlRepository.GetByShortCodeAsync(request.ShortCode);

        if (shortenedUrl is null)
        {
            return ErrorsUrl.NotFound;
        }

        if (shortenedUrl.IsExpired())
        {
            return ErrorsUrl.Expired;
        }

        var requiresInterstitial = false;
        var interstitialReason = InterstitialReason.None;

        if (shortenedUrl.SafetyStatus == UrlSafetyStatus.Danger)
        {
            requiresInterstitial = true;
            interstitialReason = InterstitialReason.Danger;
        }

        if (shortenedUrl.SafetyStatus == UrlSafetyStatus.Pending)
        {
            var recheckStatus = await _urlSafetyService.CheckUrlSafetyAsync(
                shortenedUrl.OriginalUrl.Value, cancellationToken);

            if (recheckStatus == UrlSafetyStatus.Danger)
            {
                shortenedUrl.UpdateSafetyStatus(UrlSafetyStatus.Danger);
                await _shortenedUrlRepository.UpdateAsync(shortenedUrl, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                requiresInterstitial = true;
                interstitialReason = InterstitialReason.Danger;
            }

            if (recheckStatus == UrlSafetyStatus.Safe)
            {
                shortenedUrl.UpdateSafetyStatus(UrlSafetyStatus.Safe);
                await _shortenedUrlRepository.UpdateAsync(shortenedUrl, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }

        if (!requiresInterstitial)
        {
            var isGuest = shortenedUrl.UserId == null;
            requiresInterstitial = await _domainSafetyService.ShouldShowInterstitialAsync(
                shortenedUrl.OriginalUrl.Value, isGuest, cancellationToken);
            if (requiresInterstitial)
            {
                interstitialReason = InterstitialReason.GuestOrYoungDomain;
            }
        }

        _channelWriter.TryWrite(new ClickEvent(request.ShortCode, request.IpAddress, request.UserAgent, DateTime.UtcNow));

        var response = new GetOriginalUrlResponse(shortenedUrl.OriginalUrl.Value, requiresInterstitial, interstitialReason);

        var cacheResponse = new CachedRedirectResponse(
            shortenedUrl.OriginalUrl.Value,
            requiresInterstitial,
            interstitialReason,
            shortenedUrl.SafetyStatus);

        var ttl = GetCacheDuration(shortenedUrl.SafetyStatus);
        await _cacheService.SetAsync(cacheKey, JsonSerializer.Serialize(cacheResponse), ttl, cancellationToken);

        return response;
    }

    private static TimeSpan GetCacheDuration(UrlSafetyStatus status) => status switch
    {
        UrlSafetyStatus.Safe => TimeSpan.FromDays(3),
        UrlSafetyStatus.Pending => TimeSpan.FromMinutes(2),
        UrlSafetyStatus.Danger => TimeSpan.FromDays(3),
        _ => TimeSpan.FromMinutes(2)
    };
}
