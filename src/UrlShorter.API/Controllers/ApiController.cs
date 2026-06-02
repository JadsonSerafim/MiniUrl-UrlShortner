using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Enums;

namespace UrlShorter.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiController : ControllerBase
{
    protected Guid? GetUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Guid.TryParse(userIdString, out var userId) ? userId : null;
    }

    protected IActionResult HandleFailure(Result result)
    {
        if (result.IsSuccess)
        {
            throw new InvalidOperationException("...");

        }

        return result.Error switch
        {
            ValidationError validationError => BadRequest(new
            {
                Title = validationError.Description,
                Status = StatusCodes.Status400BadRequest,
                Errors = validationError.Errors
            }),
            _ => result.Error.Type switch
            {
                ErrorType.NotFound => NotFound(result.Error),
                ErrorType.Conflict => Conflict(result.Error),
                ErrorType.Unauthorized => Unauthorized(result.Error),
                ErrorType.Forbidden => Forbid(),
                _ => BadRequest(result.Error)
            }

        };
    }

    protected IActionResult ProcessResult(Result result)
    => result.IsSuccess ? Ok() : HandleFailure(result);

    protected IActionResult ProcessResult<T>(Result<T> result) where T : class
    => result.IsSuccess ?
        Ok(result.Value) : HandleFailure(result);

    protected IActionResult ProcessCreatedResult<T>(Result<T> result, string uri = "") where T : class
    => result.IsSuccess ?
        Created(uri, result.Value) : HandleFailure(result);
}
