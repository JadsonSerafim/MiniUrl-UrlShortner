using Moq;
using FluentAssertions;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;
using System.Threading.Channels;
using UrlShorter.Domain.Interfaces;
using Xunit;

namespace UrlShorter.Application.UnitTests;

public class GetOriginalUrlHandlerTests
{
    private readonly Mock<IShortenedUrlRepository> _repoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ICacheService> _cacheMock;
    private readonly Mock<ChannelWriter<ClickEvent>> _channelWriterMock;
    private readonly Mock<IUrlSafetyService> _safetyMock;
    private readonly Mock<IDomainSafetyService> _domainSafetyMock;
    private readonly GetOriginalUrlHandler _handler;

    public GetOriginalUrlHandlerTests()
    {
        _repoMock = new Mock<IShortenedUrlRepository>();
        _uowMock = new Mock<IUnitOfWork>();
        _cacheMock = new Mock<ICacheService>();
        _channelWriterMock = new Mock<ChannelWriter<ClickEvent>>();
        _safetyMock = new Mock<IUrlSafetyService>();
        _domainSafetyMock = new Mock<IDomainSafetyService>();

        _handler = new GetOriginalUrlHandler(
            _repoMock.Object,
            _uowMock.Object,
            _cacheMock.Object,
            _channelWriterMock.Object,
            _safetyMock.Object,
            _domainSafetyMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnOriginalUrl_WhenUrlIsSafeAndActive()
    {
        // Arrange
        var shortCode = "abc123";
        var originalUrl = "https://google.com";
        var urlVO = Url.Create(originalUrl).Value;
        var shortenedUrl = ShortenedUrl.Create(urlVO, shortCode).Value;

        _repoMock.Setup(r => r.GetByShortCodeAsync(shortCode))
            .ReturnsAsync(shortenedUrl);
        
        _domainSafetyMock.Setup(d => d.ShouldShowInterstitialAsync(originalUrl, It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var query = new GetOriginalUrlQuery(shortCode, "127.0.0.1", "agent");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.OriginalUrl.Should().Be(originalUrl);
        result.Value.RequiresInterstitial.Should().BeFalse();
        _channelWriterMock.Verify(w => w.TryWrite(It.IsAny<ClickEvent>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnRequiresInterstitial_WhenDomainSafetyServiceReturnsTrue()
    {
        // Arrange
        var shortCode = "abc123";
        var originalUrl = "https://google.com";
        var urlVO = Url.Create(originalUrl).Value;
        var shortenedUrl = ShortenedUrl.Create(urlVO, shortCode).Value;

        _repoMock.Setup(r => r.GetByShortCodeAsync(shortCode))
            .ReturnsAsync(shortenedUrl);
        
        _domainSafetyMock.Setup(d => d.ShouldShowInterstitialAsync(originalUrl, It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var query = new GetOriginalUrlQuery(shortCode, "127.0.0.1", "agent");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.RequiresInterstitial.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_ShouldReturnNotFound_WhenShortCodeDoesNotExist()
    {
        // Arrange
        _repoMock.Setup(r => r.GetByShortCodeAsync(It.IsAny<string>()))
            .ReturnsAsync((ShortenedUrl?)null);

        var query = new GetOriginalUrlQuery("missing", "127.0.0.1", "agent");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.NotFound);
    }

    [Fact]
    public async Task Handle_ShouldReturnExpired_WhenUrlIsExpired()
    {
        // Arrange
        var shortCode = "abc123";
        var urlVO = Url.Create("https://google.com").Value;
        // Create expired url by passing a past date and a userId to avoid override
        var shortenedUrl = ShortenedUrl.Create(urlVO, shortCode, Guid.NewGuid(), DateTime.UtcNow.AddHours(-1)).Value;

        _repoMock.Setup(r => r.GetByShortCodeAsync(shortCode))
            .ReturnsAsync(shortenedUrl);

        var query = new GetOriginalUrlQuery(shortCode, "127.0.0.1", "agent");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.Expired);
    }
}
