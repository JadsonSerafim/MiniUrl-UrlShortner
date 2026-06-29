using Moq;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
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
    private readonly Mock<IServiceScopeFactory> _scopeFactoryMock;
    private readonly Mock<IDomainSafetyService> _domainSafetyMock;
    private readonly CreateShortenedUrlHandler _handler;

    public CreateShortenedUrlHandlerTests()
    {
        _repoMock = new Mock<IShortenedUrlRepository>();
        _uowMock = new Mock<IUnitOfWork>();
        _generatorMock = new Mock<IShortCodeGenerator>();
        _scopeFactoryMock = new Mock<IServiceScopeFactory>();
        _domainSafetyMock = new Mock<IDomainSafetyService>();
        
        _handler = new CreateShortenedUrlHandler(
            _repoMock.Object, 
            _uowMock.Object, 
            _generatorMock.Object, 
            _scopeFactoryMock.Object,
            _domainSafetyMock.Object);

        _generatorMock.Setup(g => g.Generate()).Returns("abc123");
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
    public async Task Handle_ShouldCreateUrlWithPendingStatus_WhenUrlIsMalicious()
    {
        // Arrange
        var command = new CreateShortenedUrlCommand("https://malicious.com", null, null, null);
        _repoMock.Setup(r => r.ShortCodeExistsAndActiveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        ShortenedUrl? capturedUrl = null;
        _repoMock.Setup(r => r.AddAsync(It.IsAny<ShortenedUrl>(), It.IsAny<CancellationToken>()))
            .Callback<ShortenedUrl, CancellationToken>((url, _) => capturedUrl = url)
            .ReturnsAsync((ShortenedUrl url, CancellationToken _) => url);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        capturedUrl.Should().NotBeNull();
        capturedUrl!.SafetyStatus.Should().Be(UrlSafetyStatus.Pending);
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
