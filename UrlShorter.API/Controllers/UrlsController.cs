using MediatR;
using Microsoft.AspNetCore.Mvc;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;

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

}