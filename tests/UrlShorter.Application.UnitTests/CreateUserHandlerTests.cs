using Moq;
using FluentAssertions;
using UrlShorter.Application.UseCases.Users.Commands.CreateUser;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Application.UnitTests;

public class CreateUserHandlerTests
{
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<IPasswordHasher> _hasherMock;
    private readonly Mock<IUserRepository> _repoMock;
    private readonly CreateUserHandler _handler;

    public CreateUserHandlerTests()
    {
        _uowMock = new Mock<IUnitOfWork>();
        _hasherMock = new Mock<IPasswordHasher>();
        _repoMock = new Mock<IUserRepository>();
        _handler = new CreateUserHandler(_uowMock.Object, _hasherMock.Object, _repoMock.Object);

        _hasherMock.Setup(h => h.Hash(It.IsAny<string>())).Returns("hashed_password");
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenDataIsValid()
    {
        // Arrange
        var command = new CreateUserCommand("Jadson", "test@example.com", "Password123!", true);
        _repoMock.Setup(r => r.IsEmailUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _repoMock.Verify(r => r.AddAsync(It.IsAny<UrlShorter.Domain.Entities.User>(), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenEmailIsNotUnique()
    {
        // Arrange
        var command = new CreateUserCommand("Jadson", "duplicate@example.com", "Password123!", true);
        _repoMock.Setup(r => r.IsEmailUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsEmail.AlreadyExists);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenEmailIsInvalid()
    {
        // Arrange
        var command = new CreateUserCommand("Jadson", "invalid-email", "Password123!", true);
        _repoMock.Setup(r => r.IsEmailUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsEmail.Invalid);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenPasswordIsInvalid()
    {
        // Arrange
        var command = new CreateUserCommand("Jadson", "test@example.com", "weak", true);
        _repoMock.Setup(r => r.IsEmailUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsPassword.InvalidLength);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenConsentNotGiven()
    {
        // Arrange
        var command = new CreateUserCommand("Jadson", "test@example.com", "Password123!", false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUser.ConsentRequired);
    }
}
