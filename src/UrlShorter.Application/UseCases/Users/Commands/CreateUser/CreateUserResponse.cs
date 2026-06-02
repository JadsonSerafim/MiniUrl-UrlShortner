namespace UrlShorter.Application.UseCases.Users.Commands.CreateUser;

public record CreateUserResponse(Guid Id, string Name, string Email);
