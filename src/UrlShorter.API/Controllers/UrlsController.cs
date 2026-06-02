using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static System.Net.WebRequestMethods;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetAllUserUrls;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetUrlAnalytics;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.ExtendExpiration;
using UrlShorter.Domain.Entities;

namespace UrlShorter.API.Controllers;

public class UrlsController : ApiController
{
    private readonly ISender _sender;
    private readonly IConfiguration _configuration;

    public UrlsController(ISender sender, IConfiguration configuration)
    {
        _sender = sender;
        _configuration = configuration;
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

        var frontendUrl = _configuration["FrontendUrl"];

        if (result.IsSuccess)
        {
            if (result.Value.RequiresInterstitial)
            {
                // Codifica a URL original para passar como parâmetro na query
                var encodedUrl = Uri.EscapeDataString(result.Value.OriginalUrl);
                return Redirect($"{frontendUrl}/redirect?target={encodedUrl}");
            }

            return Redirect(result.Value.OriginalUrl);
        }

        if (result.Error.Code == "Url.Expired")
        {
            return Redirect($"{frontendUrl}/expired?code={shortCode}");
        }

        return Redirect($"{frontendUrl}/not-found?code={shortCode}");
    }

    [Authorize]
    [HttpGet("my-urls")]
    public async Task<IActionResult> GetMyUrls(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var query = new GetAllUserUrlsQuery(userId.Value);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure && result.Error.Code == "Url.NotFound")
        {
            return Ok(Array.Empty<ShortenedUrl>());
        }

        return ProcessResult(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserUrls([FromRoute] Guid userId, CancellationToken cancellationToken)
    {
        var query = new GetAllUserUrlsQuery(userId);
        return ProcessResult(await _sender.Send(query, cancellationToken));
    }

    [HttpGet("{shortCode}/analytics")]
    public async Task<IActionResult> GetUrlAnalytics(
        [FromRoute] string shortCode,
        [FromQuery] Guid userId,
        CancellationToken cancellationToken)
    {
        var query = new GetUrlAnalyticsQuery(shortCode, userId);
        return ProcessResult(await _sender.Send(query, cancellationToken));
    }

    [Authorize]
    [HttpPatch("{shortCode}/extend")]
    public async Task<IActionResult> ExtendExpiration(
        [FromRoute] string shortCode,
        [FromBody] ExtendUrlExpirationRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        var command = new ExtendUrlExpirationCommand(shortCode, request.Quantity, request.Unit, userId.Value);
        return ProcessResult(await _sender.Send(command, cancellationToken));
    }
}