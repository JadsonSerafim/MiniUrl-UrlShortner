using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public record CreateShortenedUrlCommand(string OriginalUrl, Guid? UserId = null, DateTime? ExpiresAt = null, string? Name = null)
: IRequest<Result<string>>;
