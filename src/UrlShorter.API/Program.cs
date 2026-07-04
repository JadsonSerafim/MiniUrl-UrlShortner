using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.OpenApi.Models;
using UrlShorter.API.Middlewares;
using UrlShorter.Application;
using UrlShorter.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "UrlShorter API",
        Version = "v1",
        Description = "API para encurtamento de URLs com verificação de segurança"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira seu token JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseMiddleware<SecurityHeadersMiddleware>();

app.UseCors(policy =>
{
    var frontendUrl = builder.Configuration["FrontendUrl"]
        ?? builder.Configuration["FRONTEND_URL"]
        ?? "http://localhost:5173";

    policy.WithOrigins(frontendUrl)
          .AllowAnyHeader()
          .AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<GuestRateLimitMiddleware>();

app.MapHealthChecks("/health");

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "UrlShorter API v1");
        c.RoutePrefix = "swagger";
    });
}

app.Run();
public partial class Program { }
