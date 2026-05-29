using MediatR;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Application.UseCases.Users.Commands.CreateUser;
using UrlShorter.Application.UseCases.Users.Commands.ForgotPassword;
using UrlShorter.Application.UseCases.Users.Commands.Login;
using UrlShorter.Application.UseCases.Users.Commands.ResetPassword;

namespace UrlShorter.API.Controllers;

[Route("api/users")]
public class UsersController : ApiController
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand command)
    {
        var result = await _sender.Send(command);

        return ProcessCreatedResult(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _sender.Send(command);

        return ProcessResult(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        var result = await _sender.Send(command);

        return ProcessResult(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        var result = await _sender.Send(command);

        return ProcessResult(result);
    }

}
