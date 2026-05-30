using UrlShorter.Application.Interfaces;
namespace UrlShorter.Application.UseCases.Users.Commands.Login;

public record LoginResponse(Guid Id, string Name, string Email, string RefreshToken, AuthToken Token);
