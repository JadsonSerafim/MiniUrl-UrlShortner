using Microsoft.AspNetCore.HttpOverrides;
using UrlShorter.API.Middlewares;
using UrlShorter.Application;
using UrlShorter.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors(policy =>
{
    var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:5173";
    policy.WithOrigins(frontendUrl)
          .AllowAnyHeader()
          .AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<GuestRateLimitMiddleware>();

app.MapHealthChecks("/health");

app.MapControllers();

app.Run();
