using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using UrlShorter.Application.Common.Behaviors;

namespace UrlShorter.Application;

public static class DependencyInjection
{


    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        return services;

    }
}