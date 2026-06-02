using Moq;
using FluentAssertions;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Infrastructure.Services;
using Xunit;

namespace UrlShorter.Infrastructure.UnitTests;

public class DomainSafetyServiceTests
{
    private readonly Mock<IDomainSafetyRepository> _repositoryMock;
    private readonly Mock<IWhoisService> _whoisMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly DomainSafetyService _service;

    public DomainSafetyServiceTests()
    {
        _repositoryMock = new Mock<IDomainSafetyRepository>();
        _whoisMock = new Mock<IWhoisService>();
        _uowMock = new Mock<IUnitOfWork>();
        _service = new DomainSafetyService(_repositoryMock.Object, _whoisMock.Object, _uowMock.Object);
    }

    [Fact]
    public async Task IsDomainTooYoungAsync_ShouldReturnFalse_WhenDomainInDbIsOld()
    {
        // Arrange
        var domain = "google.com";
        var url = $"https://{domain}";
        var oldDate = DateTime.UtcNow.AddDays(-40);
        var safety = DomainSafety.Create(domain, oldDate);

        _repositoryMock.Setup(r => r.GetByDomainNameAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync(safety);

        // Act
        var result = await _service.IsDomainTooYoungAsync(url);

        // Assert
        result.Should().BeFalse();
        _whoisMock.Verify(w => w.GetDomainCreationDateAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task IsDomainTooYoungAsync_ShouldReturnTrue_WhenDomainInDbIsYoung()
    {
        // Arrange
        var domain = "newsite.com";
        var url = $"https://{domain}";
        var youngDate = DateTime.UtcNow.AddDays(-10);
        var safety = DomainSafety.Create(domain, youngDate);

        _repositoryMock.Setup(r => r.GetByDomainNameAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync(safety);

        // Act
        var result = await _service.IsDomainTooYoungAsync(url);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IsDomainTooYoungAsync_ShouldFetchFromWhoisAndSave_WhenNotInDb()
    {
        // Arrange
        var domain = "external.com";
        var url = $"https://{domain}";
        var creationDate = DateTime.UtcNow.AddDays(-40);

        _repositoryMock.Setup(r => r.GetByDomainNameAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync((DomainSafety?)null);

        _whoisMock.Setup(w => w.GetDomainCreationDateAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync(creationDate);

        // Act
        var result = await _service.IsDomainTooYoungAsync(url);

        // Assert
        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<DomainSafety>(), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ShouldShowInterstitialAsync_ShouldReturnTrue_WhenIsGuest()
    {
        // Act
        var result = await _service.ShouldShowInterstitialAsync("https://any.com", isGuest: true);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task ShouldShowInterstitialAsync_ShouldReturnTrue_WhenDomainAgeIsLessThan90Days()
    {
        // Arrange
        var domain = "young.com";
        var url = $"https://{domain}";
        var date80DaysAgo = DateTime.UtcNow.AddDays(-80);
        var safety = DomainSafety.Create(domain, date80DaysAgo);

        _repositoryMock.Setup(r => r.GetByDomainNameAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync(safety);

        // Act
        var result = await _service.ShouldShowInterstitialAsync(url, isGuest: false);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task ShouldShowInterstitialAsync_ShouldReturnFalse_WhenDomainAgeIsMoreThan90Days()
    {
        // Arrange
        var domain = "old.com";
        var url = $"https://{domain}";
        var date100DaysAgo = DateTime.UtcNow.AddDays(-100);
        var safety = DomainSafety.Create(domain, date100DaysAgo);

        _repositoryMock.Setup(r => r.GetByDomainNameAsync(domain, It.IsAny<CancellationToken>()))
            .ReturnsAsync(safety);

        // Act
        var result = await _service.ShouldShowInterstitialAsync(url, isGuest: false);

        // Assert
        result.Should().BeFalse();
    }
}
