using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using UrlShorter.Domain.Entities;

namespace UrlShorter.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<ShortenedUrl> ShortenedUrls { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        
        
        foreach(var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if(typeof(Entity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(
                    ConvertFilterExpression(entityType.ClrType)
                );
            }
        }
        
    }
     private static LambdaExpression ConvertFilterExpression(Type type)
 {
     var parameter = Expression.Parameter(type, "x");
     var property = Expression.Property(parameter, nameof(Entity.IsActive));
     var body = Expression.Equal(property, Expression.Constant(true));
     return Expression.Lambda(body, parameter);
 }
}