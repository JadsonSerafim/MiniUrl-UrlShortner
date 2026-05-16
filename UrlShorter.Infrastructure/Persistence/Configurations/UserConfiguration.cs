using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .HasConversion(
                email => email.Value,
                value => Email.Create(value).Value
            )
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.Password)
            .HasConversion(
                password => password.Value,
                value => Password.LoadFromHash(value).Value
            )
            .IsRequired();

        builder.HasIndex(u => u.Email).IsUnique();
    }
}
