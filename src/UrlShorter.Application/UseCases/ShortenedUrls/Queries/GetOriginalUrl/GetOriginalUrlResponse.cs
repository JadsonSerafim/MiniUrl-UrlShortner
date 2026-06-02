namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public record GetOriginalUrlResponse(
    string OriginalUrl, 
    bool RequiresInterstitial);
