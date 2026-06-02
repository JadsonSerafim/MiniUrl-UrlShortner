using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public record GetOriginalUrlQuery(string? ShortCode, string? IpAddress, string? UserAgent) 
: IRequest<Result<GetOriginalUrlResponse>>;
