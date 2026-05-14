using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public record CreateShortenedUrlCommand(string OriginalUrl, DateTime? ExpiresAt = null)
: IRequest<Result<string>>;
