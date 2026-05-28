using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.ExtendExpiration;

public record ExtendUrlExpirationRequest(int Quantity, string Unit);

public record ExtendUrlExpirationCommand(string ShortCode, int Quantity, string Unit, Guid UserId)
    : IRequest<Result>;
