using FluentAssertions;
using Moq;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Domain.UnitTests;

public class UserTests
{
    private readonly Email _validEmail;
    private readonly Password _validPassword;

    public UserTests()
    {
        _validEmail = Email.Create("test@example.com").Value;
        var hasherMock = new Mock<IPasswordHasher>();
        hasherMock.Setup(h => h.Hash(It.IsAny<string>())).Returns("hash");
        _validPassword = Password.Create("Password123!", hasherMock.Object).Value;
    }

    [Fact]
    public void Create_ShouldReturnSuccess_WhenDataIsValid()
    {
        // Act
        var result = User.Create(_validEmail, "Jadson", _validPassword);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Name.Should().Be("Jadson");
        result.Value.Email.Should().Be(_validEmail);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenNameIsEmpty()
    {
        // Act
        var result = User.Create(_validEmail, "", _validPassword);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUser.NameEmpty);
    }

    [Fact]
    public void UpdateName_ShouldUpdateNameAndSetUpdatedAt()
    {
        // Arrange
        var user = User.Create(_validEmail, "Old Name", _validPassword).Value;
        var originalUpdatedAt = user.UpdatedAt;

        // Act
        user.UpdateName("New Name");

        // Assert
        user.Name.Should().Be("New Name");
        user.UpdatedAt.Should().NotBe(originalUpdatedAt);
    }

    [Fact]
    public void UpdatePassword_ShouldReturnFailure_WhenOldPasswordIsIncorrect()
    {
        // Arrange
        var hasherMock = new Mock<IPasswordHasher>();
        hasherMock.Setup(h => h.Verify("wrong", It.IsAny<string>())).Returns(false);
        
        var user = User.Create(_validEmail, "Name", _validPassword).Value;

        // Act
        var result = user.UpdatePassword("wrong", "NewPass123!", hasherMock.Object);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Password.Mismatch");
    }
}
