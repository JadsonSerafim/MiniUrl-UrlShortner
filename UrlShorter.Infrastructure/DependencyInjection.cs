using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace UrlShorter.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // TODO: registrar DbContext
        // services.AddDbContext<AppDbContext>(options =>
        //     options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // TODO: registrar Repositórios
        // services.AddScoped<IExampleRepository, ExampleRepository>();

        return services;
    }
}