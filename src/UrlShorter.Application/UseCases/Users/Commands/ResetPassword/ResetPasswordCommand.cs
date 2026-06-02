using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.Users.Commands.ResetPassword;

public record ResetPasswordCommand(
    string Email,
    string Code,
    string NewPassword,
    string ConfirmPassword) : IRequest<Result>;