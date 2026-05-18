using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Infrastructure.Persistence.Configurations;

public class ClickLogConfiguration : IEntityTypeConfiguration<ClickLog>
{
    public void Configure(EntityTypeBuilder<ClickLog> builder)
    {
        builder.ToTable("ClickLogs");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ShortCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.IpAddress)
            .HasConversion(ip => ip.Value, value => IpAddress.Create(value).Value)
            .IsRequired()
            .HasMaxLength(45);

        builder.Property(c => c.UserAgent)
            .HasMaxLength(500);

        builder.HasIndex(c => c.ShortCode);

        builder.HasIndex(c => c.CreatedAt);
    }
}
