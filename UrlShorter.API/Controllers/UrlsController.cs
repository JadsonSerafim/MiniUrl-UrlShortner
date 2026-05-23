using MediatR;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetAllUserUrls;

namespace UrlShorter.API.Controllers;

public class UrlsController : ApiController
{
    private readonly ISender _sender;

    public UrlsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> ShortenUrl([FromBody] CreateShortenedUrlCommand command, CancellationToken cancellationToken)
    {
        return ProcessResult(await _sender.Send(command, cancellationToken));
    }

    [HttpGet("/{shortCode}")]
    public async Task<IActionResult> RedirectTo([FromRoute] string shortCode)
    {
        string? ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        string? userAgent = HttpContext.Request.Headers.UserAgent.ToString();
        var query = new GetOriginalUrlQuery(shortCode, ipAddress, userAgent);
        var result = await _sender.Send(query);

        return result.IsSuccess
            ? Redirect(result.Value)
            : HandleFailure(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserUrls([FromRoute] Guid userId, CancellationToken cancellationToken)
    {
        var query = new GetAllUserUrlsQuery(userId);
        return ProcessResult(await _sender.Send(query, cancellationToken));
    }
}