namespace UrlShorter.Application.UseCases.Users.Commands.ExportUserData;

public record ExportUserDataResponse(
    UserData User,
    List<UrlData> Urls,
    DateTime ExportedAt
);

public record UserData(
    Guid Id,
    string Name,
    string Email,
    DateTime CreatedAt,
    DateTime? ConsentGivenAt
);

public record UrlData(
    string ShortCode,
    string OriginalUrl,
    string? Name,
    int ClickCount,
    DateTime ExpiresAt,
    DateTime CreatedAt
);
