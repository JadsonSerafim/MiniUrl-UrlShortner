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

    public static readonly Error UserUrlLimitExceeded = Error.Validation(
    "Url.LimitExceeded",
    "Limite de URLs atingido. Por favor, remova URLs antigas para criar novas.");

    public static readonly Error InvalidName = Error.Validation(
        "Url.InvalidName",
        "O nome deve ter no máximo 30 caracteres.");

    public static readonly Error InvalidExtensionQuantity = Error.Validation(
        "Url.InvalidExtensionQuantity",
        "A quantidade de dias/meses deve ser maior que zero.");

    public static readonly Error InvalidExtensionUnit = Error.Validation(
        "Url.InvalidExtensionUnit",
        "A unidade deve ser 'days' ou 'months'.");

    public static readonly Error ExtensionExceedsLimit = Error.Validation(
        "Url.ExtensionExceedsLimit",
        "A data de expiração não pode ultrapassar 1 ano a partir de hoje.");

    public static readonly Error RestrictedTarget = Error.Validation(
        "Url.RestrictedTarget",
        "Esta URL aponta para um recurso restrito ou proibido.");

    public static readonly Error MaliciousTld = Error.Validation(
        "Url.MaliciousTld",
        "Esta extensão de domínio (.TLD) é frequentemente usada para fins maliciosos e está bloqueada.");

    public static readonly Error ChainRedirectForbidden = Error.Validation(
        "Url.ChainRedirectForbidden",
        "Não é permitido encurtar links de outros encurtadores.");

    public static readonly Error DomainTooYoung = Error.Validation(
        "Url.DomainTooYoung",
        "Este domínio é muito recente (menos de 30 dias) e não pode ser encurtado por motivos de segurança.");
    }