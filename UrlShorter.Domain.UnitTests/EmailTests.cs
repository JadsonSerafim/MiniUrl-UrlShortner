using FluentAssertions;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Domain.UnitTests;

public class EmailTests
{
    [Theory]
    [InlineData("test@example.com")]
    [InlineData("user.name@domain.co.uk")]
    public void Create_ShouldReturnSuccess_WhenEmailIsValid(string validEmail)
    {
        // Act
        var result = Email.Create(validEmail);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validEmail.ToLower().Trim());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Create_ShouldReturnFailure_WhenEmailIsEmpty(string? emptyEmail)
    {
        // Act
        var result = Email.Create(emptyEmail!);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsEmail.Empty);
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("test@")]
    [InlineData("@example.com")]
    [InlineData("test..example@domain.com")]
    public void Create_ShouldReturnFailure_WhenEmailIsInvalid(string invalidEmail)
    {
        // Act
        var result = Email.Create(invalidEmail);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsEmail.Invalid);
    }
}
