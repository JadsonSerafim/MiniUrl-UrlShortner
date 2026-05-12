namespace UrlShorter.Domain.ValueObjects;

public sealed record Url
{
    public string Value { get; }

    private static readonly string[] AllowedSchemes = ["https", "http"];

    public Url(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("A URL não pode ser vazia.");

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
            throw new ArgumentException($"'{value}' não é uma URL válida.");

        if (!AllowedSchemes.Contains(uri.Scheme))
            throw new ArgumentException("A URL deve usar HTTP ou HTTPS.");

        Value = value;
    }
    public static implicit operator string(Url url) => url.Value;
}