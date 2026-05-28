using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsPasswordResetToken
{
    public static readonly Error NotFound = Error.NotFound(
        "Token.NotFound", 
        "Código inválido ou expirado.");

    public static readonly Error AlreadyUsed = Error.Conflict(
        "Token.AlreadyUsed", 
        "Código já utilizado.");

    public static readonly Error Expired = Error.Validation(
        "Token.Expired", 
        "Código expirado. Solicite um novo.");
}