using System.Threading.Channels;
using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public class GetOriginalUrlHandler : IRequestHandler<GetOriginalUrlQuery, Result<string>>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly ChannelWriter<ClickEvent> _channelWriter;

    public GetOriginalUrlHandler(IShortenedUrlRepository shortenedUrlRepository, IUnitOfWork unitOfWork, ICacheService cacheService, ChannelWriter<ClickEvent> channelWriter)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _channelWriter = channelWriter;
    }

    public async Task<Result<string>> Handle(GetOriginalUrlQuery request, CancellationToken cancellationToken)
    {
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

        await _cacheService.SetAsync(request.ShortCode, shortenedUrl.OriginalUrl.Value, TimeSpan.FromDays(2), cancellationToken);

        _channelWriter.TryWrite(new ClickEvent(request.ShortCode, request.IpAddress, request.UserAgent, DateTime.UtcNow));

        return shortenedUrl.OriginalUrl.Value;
    }
}
