namespace UrlShorter.Domain.Common.Result.Errors;

public class ErrorsPassword
{
    public static readonly Error Empty = Error.Validation("Password.Empty", "A senha não pode ser vazia.");
    public static readonly Error InvalidLength = Error.Validation("Password.InvalidLength", "A senha deve ter entre 8 e 64 caracteres.");
    public static readonly Error NoDigit = Error.Validation("Password.NoDigit", "A senha deve conter pelo menos um número.");
    public static readonly Error NoLetter = Error.Validation("Password.NoLetter", "A senha deve conter pelo menos uma letra.");
    public static readonly Error NoUpper = Error.Validation("Password.NoUpper", "A senha deve conter pelo menos uma letra maiúscula.");
    public static readonly Error NoLower = Error.Validation("Password.NoLower", "A senha deve conter pelo menos uma letra minúscula.");
    public static readonly Error Invalid = Error.Validation("Password.Invalid", "A senha deve conter pelo menos um número, uma letra maiúscula e uma letra minúscula.");
}
