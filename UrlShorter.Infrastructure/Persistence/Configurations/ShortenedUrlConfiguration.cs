using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Infrastructure.Persistence.Configurations;

public class ShortenedUrlConfiguration : IEntityTypeConfiguration<ShortenedUrl>
{
    public void Configure(EntityTypeBuilder<ShortenedUrl> builder)
    {
        builder.ToTable("ShortenedUrls");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .HasMaxLength(30)
            .IsRequired(false);

        builder.Property(u => u.OriginalUrl)
            .HasConversion(url => url.Value, value => Url.Create(value).Value)
            .IsRequired();

        builder.Property(u => u.ShortCode)
            .IsRequired();

        builder.HasIndex(u => u.ShortCode)
            .IsUnique();

        builder.Property(u => u.ExpiresAt)
            .IsRequired();

        builder.Property(u => u.ClickCount)
            .IsRequired();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(u => u.UserId);
    }
}
