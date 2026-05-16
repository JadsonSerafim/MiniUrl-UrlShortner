using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Entities;

namespace UrlShorter.Application.UseCases.Users.Commands.CreateUser;

public record CreateUserCommand(string Name, string Email, string Password) : IRequest<Result<CreateUserResponse>>;
