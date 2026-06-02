namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsEmail
{
    public static readonly Error Empty = Error.Validation("Email.Empty", "O email não pode ser vazio.");
    public static readonly Error Invalid = Error.Validation("Email.Invalid", "O email é inválido.");
    public static readonly Error AlreadyExists = Error.Validation("Email.AlreadyExists", "O email já está cadastrado.");
}
