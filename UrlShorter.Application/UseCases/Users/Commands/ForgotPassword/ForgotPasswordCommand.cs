using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.Users.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Email) : IRequest<Result>;