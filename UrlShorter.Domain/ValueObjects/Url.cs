using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Domain.ValueObjects;

public sealed record Url
{
    public string Value { get; }

    private static readonly string[] AllowedSchemes = ["https", "http"];

    private Url(string value) => Value = value;


    public static Result<Url> Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
           return ErrorsUrl.Empty;
        }

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            return ErrorsUrl.InvalidFormat;
        }

        if (!AllowedSchemes.Contains(uri.Scheme))
        {
            return ErrorsUrl.HttpInvalid;
        }

       return new Url(value);
    }

    public static implicit operator string(Url url) => url.Value;
}