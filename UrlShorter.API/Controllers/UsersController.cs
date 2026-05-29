using MediatR;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Application.UseCases.Users.Commands.CreateUser;
using UrlShorter.Application.UseCases.Users.Commands.ForgotPassword;
using UrlShorter.Application.UseCases.Users.Commands.Login;
using UrlShorter.Application.UseCases.Users.Commands.RefreshToken;
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

        if (result.IsSuccess)
        {
            SetTokenCookies(result.Value);
        }

        return ProcessResult(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized();

        var result = await _sender.Send(new RefreshTokenCommand(refreshToken));

        if (result.IsSuccess)
        {
            SetTokenCookies(result.Value);
        }

        return ProcessResult(result);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");
        return Ok();
    }

    private void SetTokenCookies(LoginResponse response)
    {
        var accessOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = response.Token.ExpiresAt
        };

        var refreshOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/api/users/refresh"
        };

        Response.Cookies.Append("accessToken", response.Token.Token, accessOptions);
        Response.Cookies.Append("refreshToken", response.RefreshToken, refreshOptions);
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
