using Moq;
using FluentAssertions;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using Xunit;

namespace UrlShorter.Application.UnitTests;

public class CreateShortenedUrlHandlerTests
{
    private readonly Mock<IShortenedUrlRepository> _repoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<IShortCodeGenerator> _generatorMock;
    private readonly Mock<IUrlSafetyService> _safetyMock;
    private readonly Mock<IDomainSafetyService> _domainSafetyMock;
    private readonly CreateShortenedUrlHandler _handler;

    public CreateShortenedUrlHandlerTests()
    {
        _repoMock = new Mock<IShortenedUrlRepository>();
        _uowMock = new Mock<IUnitOfWork>();
        _generatorMock = new Mock<IShortCodeGenerator>();
        _safetyMock = new Mock<IUrlSafetyService>();
        _domainSafetyMock = new Mock<IDomainSafetyService>();
        
        _handler = new CreateShortenedUrlHandler(
            _repoMock.Object, 
            _uowMock.Object, 
            _generatorMock.Object, 
            _safetyMock.Object,
            _domainSafetyMock.Object);

        _generatorMock.Setup(g => g.Generate()).Returns("abc123");
        _safetyMock.Setup(s => s.CheckUrlSafetyAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(UrlSafetyStatus.Safe);
        _domainSafetyMock.Setup(d => d.IsDomainTooYoungAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenDataIsValid()
    {
        // Arrange
        var command = new CreateShortenedUrlCommand("https://google.com", null, null, null);
        _repoMock.Setup(r => r.ShortCodeExistsAndActiveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("abc123");
        _repoMock.Verify(r => r.AddAsync(It.IsAny<ShortenedUrl>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenUrlIsMalicious()
    {
        // Arrange
        var command = new CreateShortenedUrlCommand("https://malicious.com", null, null, null);
        _safetyMock.Setup(s => s.CheckUrlSafetyAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(UrlSafetyStatus.Danger);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrlSafety.MaliciousUrl);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenDomainTooYoung()
    {
        // Arrange
        var command = new CreateShortenedUrlCommand("https://new.com", null, null, null);
        _domainSafetyMock.Setup(d => d.IsDomainTooYoungAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.DomainTooYoung);
    }
}
