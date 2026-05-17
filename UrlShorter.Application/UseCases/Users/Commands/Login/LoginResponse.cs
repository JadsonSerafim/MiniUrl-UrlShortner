using UrlShorter.Application.Interfaces;
namespace UrlShorter.Application.UseCases.Users.Commands.Login;

public record LoginResponse(string Name, AuthToken Token);
