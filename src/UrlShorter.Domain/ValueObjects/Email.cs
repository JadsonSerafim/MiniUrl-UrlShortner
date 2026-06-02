using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using System.Net.Mail;

namespace UrlShorter.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Result<Email> Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return ErrorsEmail.Empty;

        try
        {
            var addr = new MailAddress(value);
            if (addr.Address != value) return ErrorsEmail.Invalid;

            return new Email(value.ToLower().Trim());
        }
        catch
        {
            return ErrorsEmail.Invalid;
        }
    }

    public static implicit operator string(Email email) => email.Value;
}
