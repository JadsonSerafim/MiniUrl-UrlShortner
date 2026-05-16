using MediatR;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Application.UseCases.Users.Commands.CreateUser;

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
}
