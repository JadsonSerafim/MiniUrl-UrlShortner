using FluentAssertions;
using Moq;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Domain.UnitTests;

public class PasswordTests
{
    private readonly Mock<IPasswordHasher> _hasherMock;

    public PasswordTests()
    {
        _hasherMock = new Mock<IPasswordHasher>();
        _hasherMock.Setup(h => h.Hash(It.IsAny<string>())).Returns("hashed_password");
    }

    [Fact]
    public void Create_ShouldReturnSuccess_WhenPasswordIsValid()
    {
        // Act
        var result = Password.Create("Password123!", _hasherMock.Object);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be("hashed_password");
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenPasswordIsEmpty()
    {
        // Act
        var result = Password.Create("", _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUser.PasswordEmpty);
    }

    [Theory]
    [InlineData("Short1!")]
    [InlineData("ThisIsAVeryLongPasswordThatExceedsTheLimitOfSixtyFourCharacters123456789!")]
    public void Create_ShouldReturnFailure_WhenLengthIsInvalid(string password)
    {
        // Act
        var result = Password.Create(password, _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.InvalidLength);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenDigitIsMissing()
    {
        // Act
        var result = Password.Create("NoDigitAllowed!", _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.NoDigit);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenUpperIsMissing()
    {
        // Act
        var result = Password.Create("noupper1!", _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.NoUpper);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenLowerIsMissing()
    {
        // Act
        var result = Password.Create("NOLOWER1!", _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.NoLower);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenSpecialCharIsMissing()
    {
        // Act
        var result = Password.Create("NoSpecialChar1", _hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.SpecialCharacterRequired);
    }
}
