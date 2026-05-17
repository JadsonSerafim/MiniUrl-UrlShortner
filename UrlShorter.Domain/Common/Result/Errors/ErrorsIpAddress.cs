using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Enums;

namespace UrlShorter.Domain.Common.Result.Errors;

public static class ErrorsIpAddress
{
    public static readonly Error IpAddressEmpty = Error.Validation("IpAddress.IpAddressEmpty", "O endereço IP não pode ser vazio.");
    public static readonly Error IpAddressInvalid = Error.Validation("IpAddress.IpAddressInvalid", "O formato do endereço IP é inválido.");
}
