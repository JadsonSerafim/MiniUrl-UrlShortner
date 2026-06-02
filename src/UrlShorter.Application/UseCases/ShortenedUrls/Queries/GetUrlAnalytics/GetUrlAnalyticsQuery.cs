using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;

public record GetUrlAnalyticsQuery(string ShortCode, Guid UserId)
    : IRequest<Result<UrlAnalyticsResponse>>;
