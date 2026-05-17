using MediatR;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

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
        var query = new GetOriginalUrlQuery(shortCode);
        var result = await _sender.Send(query);

        return result.IsSuccess
            ? Redirect(result.Value)
            : HandleFailure(result);
    }


}