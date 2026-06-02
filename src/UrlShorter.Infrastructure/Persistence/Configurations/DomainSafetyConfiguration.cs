using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShorter.Domain.Entities;

namespace UrlShorter.Infrastructure.Persistence.Configurations;

public class DomainSafetyConfiguration : IEntityTypeConfiguration<DomainSafety>
{
    public void Configure(EntityTypeBuilder<DomainSafety> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.DomainName)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(d => d.DomainName)
            .IsUnique();

        builder.Property(d => d.DomainCreatedAt)
            .IsRequired();

        builder.Property(d => d.LastCheckedAt)
            .IsRequired();
    }
}
