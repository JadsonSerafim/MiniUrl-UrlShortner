using UrlShorter.Application;
using UrlShorter.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// --- Camadas de Clean Architecture ---
// builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// --- Controllers ---
builder.Services.AddControllers();

// --- Swagger ---
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();