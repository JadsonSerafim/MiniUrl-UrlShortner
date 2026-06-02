using System.Net;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace UrlShorter.API.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocorreu uma exceção não tratada na API.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new
        {
            Code = "Server.InternalError",
            Description = _env.IsDevelopment()
                ? $"Erro: {exception.Message}"
                : "Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.",
            Type = 0
        };

        if (_env.IsDevelopment())
        {
            var devResponse = new
            {
                response.Code,
                response.Description,
                response.Type,
                StackTrace = exception.StackTrace
            };
            await context.Response.WriteAsJsonAsync(devResponse);
        }
        else
        {
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
