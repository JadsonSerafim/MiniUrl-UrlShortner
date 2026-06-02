using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.Users.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<LoginResponse>>;
