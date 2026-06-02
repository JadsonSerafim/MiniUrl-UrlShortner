using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.ExtendExpiration;

public class ExtendUrlExpirationHandler : IRequestHandler<ExtendUrlExpirationCommand, Result>
{
    private readonly IShortenedUrlRepository _shortenedUrlRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ExtendUrlExpirationHandler(IShortenedUrlRepository shortenedUrlRepository, IUnitOfWork unitOfWork)
    {
        _shortenedUrlRepository = shortenedUrlRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(ExtendUrlExpirationCommand request, CancellationToken cancellationToken)
    {
        var url = await _shortenedUrlRepository.GetByShortCodeAsync(request.ShortCode);
        if (url is null)
            return ErrorsUrl.NotFound;

        if (url.UserId != request.UserId)
            return ErrorsUrl.NotFound;

        if (!url.IsActive)
            return ErrorsUrl.NotFound;

        var result = url.ExtendExpiration(request.Quantity, request.Unit);
        if (result.IsFailure)
            return result;

        await _shortenedUrlRepository.UpdateAsync(url, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
