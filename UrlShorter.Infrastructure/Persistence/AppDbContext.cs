using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using UrlShorter.Domain.Entities;

namespace UrlShorter.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<ShortenedUrl> ShortenedUrls { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ClickLog> ClickLogs { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        foreach(var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(Entity).IsAssignableFrom(entityType.ClrType))
            {
            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(GetIsActiveFilter(entityType.ClrType));
            }
        }
    }
    private static LambdaExpression GetIsActiveFilter(Type entityType)
    {
        var entity = Expression.Parameter(entityType, "entity");
        var isActiveProperty = entityType.GetProperty("IsActive")!;
        var isActive = Expression.Property(entity, isActiveProperty);
        var isActiveFilter = Expression.Lambda(Expression.Equal(isActive, Expression.Constant(true)), entity);
        return isActiveFilter;
    }
    
}