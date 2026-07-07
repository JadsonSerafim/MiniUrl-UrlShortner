using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.Users.Commands.DeleteAccount;

public record DeleteAccountCommand(Guid UserId) : IRequest<Result>;
