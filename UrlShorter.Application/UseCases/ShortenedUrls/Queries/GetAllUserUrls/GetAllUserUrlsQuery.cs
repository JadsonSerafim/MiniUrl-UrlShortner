using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Entities;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetAllUserUrls;

public record GetAllUserUrlsQuery(Guid UserId)
: IRequest<Result<List<ShortenedUrl>>>;
