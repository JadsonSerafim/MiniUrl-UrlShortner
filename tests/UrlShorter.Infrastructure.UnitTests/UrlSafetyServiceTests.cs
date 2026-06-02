using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using FluentAssertions;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Enums;
using UrlShorter.Infrastructure.Services.UrlSafety;
using Xunit;

namespace UrlShorter.Infrastructure.UnitTests;

public class UrlSafetyServiceTests
{
    private readonly Mock<ILogger<UrlSafetyService>> _loggerMock;
    private readonly List<Mock<IUrlSafetyChecker>> _checkerMocks;

    public UrlSafetyServiceTests()
    {
        _loggerMock = new Mock<ILogger<UrlSafetyService>>();
        _checkerMocks = new List<Mock<IUrlSafetyChecker>>();
    }

    private UrlSafetyService CreateService(UrlSafetySettings settings)
    {
        var options = Options.Create(settings);
        return new UrlSafetyService(_checkerMocks.Select(m => m.Object), options, _loggerMock.Object);
    }

    private UrlSafetySettings CreateDefaultSettings() => new()
    {
        Enabled = true,
        CheckTimeoutSeconds = 5,
        GoogleSafeBrowsing = new GoogleSafeBrowsingSettings { Enabled = true },
        SpamHausDbl = new SpamHausDblSettings { Enabled = true },
        Surbl = new SurblSettings { Enabled = true }
    };

    private void AddChecker(string name, bool isSafe, string? reason = null)
    {
        var mock = new Mock<IUrlSafetyChecker>();
        mock.Setup(c => c.Name).Returns(name);
        mock.Setup(c => c.CheckAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(isSafe ? UrlSafetyCheckResult.Safe : UrlSafetyCheckResult.Unsafe(reason ?? "Unsafe"));
        _checkerMocks.Add(mock);
    }

    [Fact]
    public async Task CheckUrlSafetyAsync_ShouldReturnSafe_WhenDisabledGlobally()
    {
        // Arrange
        var settings = new UrlSafetySettings { Enabled = false };
        var service = CreateService(settings);

        // Act
        var result = await service.CheckUrlSafetyAsync("https://any.com");

        // Assert
        result.Should().Be(UrlSafetyStatus.Safe);
    }

    [Fact]
    public async Task CheckUrlSafetyAsync_ShouldReturnSafe_WhenAllCheckersPass()
    {
        // Arrange
        AddChecker("GoogleSafeBrowsing", true);
        AddChecker("SpamHausDBL", true);
        var service = CreateService(CreateDefaultSettings());

        // Act
        var result = await service.CheckUrlSafetyAsync("https://safe.com");

        // Assert
        result.Should().Be(UrlSafetyStatus.Safe);
    }

    [Fact]
    public async Task CheckUrlSafetyAsync_ShouldReturnDanger_WhenAnyCheckerFlagsAsUnsafe()
    {
        // Arrange
        AddChecker("GoogleSafeBrowsing", true);
        AddChecker("SpamHausDBL", false);
        var service = CreateService(CreateDefaultSettings());

        // Act
        var result = await service.CheckUrlSafetyAsync("https://unsafe.com");

        // Assert
        result.Should().Be(UrlSafetyStatus.Danger);
    }

    [Fact]
    public async Task CheckUrlSafetyAsync_ShouldReturnPending_WhenAllCheckersFailOrTimeout()
    {
        // Arrange
        var mock = new Mock<IUrlSafetyChecker>();
        mock.Setup(c => c.Name).Returns("GoogleSafeBrowsing");
        mock.Setup(c => c.CheckAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("API Down"));
        _checkerMocks.Add(mock);

        var service = CreateService(CreateDefaultSettings());

        // Act
        var result = await service.CheckUrlSafetyAsync("https://timeout.com");

        // Assert
        result.Should().Be(UrlSafetyStatus.Pending);
    }

    [Fact]
    public async Task CheckUrlSafetyAsync_ShouldOnlyRunEnabledCheckers()
    {
        // Arrange
        var settings = new UrlSafetySettings
        {
            Enabled = true,
            CheckTimeoutSeconds = 5,
            GoogleSafeBrowsing = new GoogleSafeBrowsingSettings { Enabled = true },
            SpamHausDbl = new SpamHausDblSettings { Enabled = false },
            Surbl = new SurblSettings { Enabled = true }
        };
        
        AddChecker("GoogleSafeBrowsing", true);
        AddChecker("SpamHausDBL", false); // Even if it would return unsafe, it shouldn't be called

        var service = CreateService(settings);

        // Act
        var result = await service.CheckUrlSafetyAsync("https://safe-enough.com");

        // Assert
        result.Should().Be(UrlSafetyStatus.Safe);
        _checkerMocks[1].Verify(c => c.CheckAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
