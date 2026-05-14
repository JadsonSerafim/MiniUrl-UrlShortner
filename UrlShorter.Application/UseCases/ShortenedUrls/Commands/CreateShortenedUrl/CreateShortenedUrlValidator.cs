using FluentValidation;
using UrlShorter.Application.Common.FluentValidationExtensions;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

public sealed class CreateShortenedUrlCommandValidator : AbstractValidator<CreateShortenedUrlCommand>
{
    public CreateShortenedUrlCommandValidator()
    {
        RuleFor(x => x.OriginalUrl)
            .NotEmpty()
            .WithError(ErrorsUrl.Empty)
            .IsValidUrl()
            .WithError(ErrorsUrl.InvalidFormat);

        RuleFor(x => x.ExpiresAt)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .WithError(ErrorsUrl.InvalidExpirationDate);
    }
}