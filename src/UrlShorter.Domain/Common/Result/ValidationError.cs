using UrlShorter.Domain.Enums;

namespace UrlShorter.Domain.Common.Result;

public sealed record ValidationError : Error
{
    public Error[] Errors { get; init; }

    private ValidationError(Error[] errors)
        : base("Validation.General", "Um ou mais errors de validação ocorreram", ErrorType.Validation)
    {
        Errors = errors;
    }
public static ValidationError FromResults(IEnumerable<Error> errors) => new(errors.ToArray());
}
