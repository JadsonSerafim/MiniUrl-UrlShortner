using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Infrastructure.Persistence.Configurations;

public class ShortenedUrlConfiguration : IEntityTypeConfiguration<ShortenedUrl>
{
    
    public void Configure(EntityTypeBuilder<ShortenedUrl> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.ShortCode).IsUnique();
        builder.Property(x => x.ShortCode).IsRequired().HasMaxLength(10);
        builder.Property(x => x.OriginalUrl).IsRequired().HasConversion(
            url => url.Value,
            value => Url.Create(value).Value);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);
        builder.Ignore(x => x.DomainEvents);
    }
    
}