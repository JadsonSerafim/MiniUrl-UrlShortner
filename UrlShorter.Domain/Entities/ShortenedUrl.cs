using UrlShorter.Domain.Common;

namespace UrlShorter.Domain.Entities;

public class ShortenedUrl : AggregateRoot
{
    
    public string OriginalUrl { get; private set; }
    public string ShortCode { get; private set; }
    
    private ShortenedUrl(){}

    public ShortenedUrl(string originalUrl, string shortCode) : base()
    {
        if (string.IsNullOrWhiteSpace(originalUrl))
            throw new ArgumentException("URL original não pode ser vazia.");
        if (!Uri.TryCreate(originalUrl, UriKind.Absolute, out _))
            throw new ArgumentException("URL original inválida.");
        if (string.IsNullOrWhiteSpace(shortCode))
            throw new ArgumentException("ShortCode não pode ser vazio.");

        OriginalUrl = originalUrl;
        ShortCode = shortCode;
    }
    public void UpdateUrl(string newUrl)
    {
        if(string.IsNullOrEmpty(newUrl)) throw new Exception("A nova Url não pode ser vazia");
        OriginalUrl = newUrl;
        Update();  
    }
}