using System.Threading.Channels;
using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public class GetOriginalUrlHandler : IRequestHandler<GetOriginalUrlQuery, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly ChannelWriter<ClickEvent> _channelWriter;
    private readonly IUrlSafetyService _urlSafetyService;

    public GetOriginalUrlHandler(
        IShortenedUrlRepository shortenedUrlRepository,
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        ChannelWriter<ClickEvent> channelWriter,
        IUrlSafetyService urlSafetyService)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _channelWriter = channelWriter;
        _urlSafetyService = urlSafetyService;
    }

    public async Task<Result<string>> Handle(GetOriginalUrlQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ShortCode))
        {
            return ErrorsUrl.NotFound;
        }

        var cacheUrl = await _cacheService.GetAsync(request.ShortCode, cancellationToken);

        if (cacheUrl is not null)
        {
            _channelWriter.TryWrite(new ClickEvent(request.ShortCode, request.IpAddress, request.UserAgent, DateTime.UtcNow));
            return cacheUrl;
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

        if (shortenedUrl.SafetyStatus == UrlSafetyStatus.Danger)
        {
            return ErrorsUrlSafety.DangerousUrl;
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
                return ErrorsUrlSafety.DangerousUrl;
            }

            if (recheckStatus == UrlSafetyStatus.Safe)
            {
                shortenedUrl.UpdateSafetyStatus(UrlSafetyStatus.Safe);
                await _shortenedUrlRepository.UpdateAsync(shortenedUrl, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }

        var cacheTtl = shortenedUrl.SafetyStatus == UrlSafetyStatus.Pending
            ? TimeSpan.FromMinutes(5)
            : TimeSpan.FromDays(2);
        if (shortenedUrl.ExpiresAt.HasValue)
        {
            var remainingTime = shortenedUrl.ExpiresAt.Value - DateTime.UtcNow;
            if (remainingTime <= TimeSpan.Zero)
            {
                return ErrorsUrl.Expired;
            }
            if (remainingTime < cacheTtl)
            {
                cacheTtl = remainingTime;
            }
        }

        await _cacheService.SetAsync(request.ShortCode, shortenedUrl.OriginalUrl.Value, cacheTtl, cancellationToken);

        _channelWriter.TryWrite(new ClickEvent(request.ShortCode, request.IpAddress, request.UserAgent, DateTime.UtcNow));

        return shortenedUrl.OriginalUrl.Value;
    }
}
