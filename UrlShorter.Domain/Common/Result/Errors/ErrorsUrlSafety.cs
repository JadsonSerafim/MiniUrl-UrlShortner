using UrlShorter.Domain.Enums;

namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsUrlSafety
{
    public static readonly Error MaliciousUrl = Error.Validation(
        "Url.Malicious",
        "Esta URL foi identificada como potencialmente maliciosa e não pode ser encurtada.");

    public static readonly Error DangerousUrl = Error.Validation(
        "Url.Dangerous",
        "Esta URL foi identificada como maliciosa e não pode ser acessada.");
}
