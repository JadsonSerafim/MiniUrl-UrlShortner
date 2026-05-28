using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Enums;

namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsUser
{
    public static readonly Error NotFound = Error.NotFound(
        "User.NotFound",
        "O usuário não foi encontrado.");
    public static readonly Error UserNotOwner = Error.Unauthorized(
        "User.UserNotOwner",
        "Você não é o dono desta URL.");

    public static readonly Error EmailEmpty = Error.Validation("User.EmailEmpty", "O email não pode ser vazio.");
    public static readonly Error EmailInvalid = Error.Validation("User.EmailInvalid", "O formato do email é inválido.");
    public static readonly Error NameEmpty = Error.Validation("User.NameEmpty", "O nome não pode ser vazio.");
    public static readonly Error UserIdInvalid = Error.Validation("User.UserIdInvalid", "O ID do usuário é inválido.");
    public static readonly Error PasswordEmpty = Error.Validation("User.PasswordEmpty", "A senha não pode ser vazia.");

    public static readonly Error InvalidCredentials = Error.Validation(
        "User.InvalidCredentials", 
        "Email ou senha inválidos");

    public static readonly Error EmailAlreadyExists = Error.Conflict(
        "User.EmailAlreadyExists", 
        "Este email já está cadastrado");
}
