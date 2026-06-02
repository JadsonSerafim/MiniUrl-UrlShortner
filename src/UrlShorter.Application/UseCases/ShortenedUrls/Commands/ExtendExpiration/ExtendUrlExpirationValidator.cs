using FluentValidation;
using UrlShorter.Application.Common.FluentValidationExtensions;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Commands.ExtendExpiration;

public class ExtendUrlExpirationValidator : AbstractValidator<ExtendUrlExpirationCommand>
{
    public ExtendUrlExpirationValidator()
    {
        RuleFor(x => x.ShortCode)
            .NotEmpty()
            .WithError(ErrorsUrl.ShortCodeEmpty);

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithError(ErrorsUrl.InvalidExtensionQuantity);

        RuleFor(x => x.Unit)
            .Must(u => u is "days" or "months")
            .WithError(ErrorsUrl.InvalidExtensionUnit);
    }
}
