using FluentValidation;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.Common.FluentValidationExtensions;

public static class FluentValidationExtensions
{
    public static IRuleBuilderOptions<T, TProperty> WithError<T, TProperty>(
        this IRuleBuilderOptions<T, TProperty> rule, Error error)
    {
        if (error is null) throw new ArgumentNullException(nameof(error));

        return rule
            .WithErrorCode(error.Code)
            .WithMessage(error.Description);
    }


    public static IRuleBuilderOptions<T, string> IsValidUrl<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _));
    }

}
