using UrlShorter.Domain.Entities;

namespace UrlShorter.Application.Interfaces;

public record AuthToken(string Token, DateTime ExpiresAt);

public interface ITokenProvider
{
    AuthToken Generate(User user);
}
