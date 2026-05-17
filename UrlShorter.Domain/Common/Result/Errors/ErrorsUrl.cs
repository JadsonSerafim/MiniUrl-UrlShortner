using UrlShorter.Domain.Enums;

namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsUrl
{
    public static readonly Error NotFound = Error.NotFound(
        "Url.NotFound",
        "A url não foi encontrada");

    public static readonly Error InvalidFormat = Error.Validation(
        "Url.InvalidFormat",
        "A Url tem um formato inválido");

    public static readonly Error Expired = Error.Validation(
        "Url.Expired",
        "Esta Url Já expirou");

    public static readonly Error AliasConflict = Error.Conflict(
        "Url.AliasConflict",
        "O codigo dessa Url já está em uso causando conflito.");

    public static readonly Error Empty = Error.Validation(
        "Url.Empty",
        "A Url não pode ser vazia");

    public static readonly Error HttpInvalid = Error.Validation(
        "Url.HttpInvalid",
        "O protocolo da Url é inválido, use http ou https");

    public static readonly Error ShortCodeEmpty = Error.Validation(
        "ShortCode.Empty",
        "O ShortCode não pode ser vazio.");

    public static readonly Error InvalidExpirationDate = Error.Validation(
        "Url.InvalidExpirationDate",
        "A data de expiração deve ser no futuro");

    public static readonly Error ExpirationTooLong = Error.Validation(
        "Url.ExpirationTooLong",
        "Visitantes só podem criar URLs com no máximo 3 dias de validade.");

    public static readonly Error ShortCodeAlreadyExists = Error.Conflict(
        "ShortCode.AlreadyExists",
        "Erro ao gerar ShortCode, Tente novamente.");
}