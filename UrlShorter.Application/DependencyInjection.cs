using System.Threading.Channels;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using UrlShorter.Application.Common.Behaviors;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

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

        var channel = Channel.CreateBounded<ClickEvent>(new BoundedChannelOptions(10000)
        {
            FullMode = BoundedChannelFullMode.DropOldest
        });
        
        services.AddSingleton(channel);
        services.AddSingleton(channel.Writer);
        services.AddSingleton(channel.Reader);

        return services;
    }
}