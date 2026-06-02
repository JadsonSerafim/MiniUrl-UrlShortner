using FluentAssertions;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Enums;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Domain.UnitTests;

public class ShortenedUrlTests
{
    private readonly Url _validUrl;

    public ShortenedUrlTests()
    {
        _validUrl = Url.Create("https://google.com").Value;
    }

    [Fact]
    public void Create_ShouldReturnSuccess_WhenDataIsValid()
    {
        // Act
        var result = ShortenedUrl.Create(_validUrl, "abc123");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.ShortCode.Should().Be("abc123");
        result.Value.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenShortCodeIsEmpty()
    {
        // Act
        var result = ShortenedUrl.Create(_validUrl, "");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.ShortCodeEmpty);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenUserLimitExceeded()
    {
        // Act
        var result = ShortenedUrl.Create(_validUrl, "abc", Guid.NewGuid(), null, 1000);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.UserUrlLimitExceeded);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenNameIsTooLong()
    {
        // Act
        var result = ShortenedUrl.Create(_validUrl, "abc", null, null, 0, new string('a', 31));

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.InvalidName);
    }

    [Fact]
    public void IsExpired_ShouldReturnTrue_WhenExpirationDateHasPassed()
    {
        // Arrange
        var result = ShortenedUrl.Create(_validUrl, "abc", Guid.NewGuid(), DateTime.UtcNow.AddMinutes(-1));
        var shortenedUrl = result.Value;

        // Act
        var isExpired = shortenedUrl.IsExpired();

        // Assert
        isExpired.Should().BeTrue();
    }

    [Fact]
    public void RegisterClick_ShouldIncrementClickCount()
    {
        // Arrange
        var shortenedUrl = ShortenedUrl.Create(_validUrl, "abc").Value;

        // Act
        shortenedUrl.RegisterClick();

        // Assert
        shortenedUrl.ClickCount.Should().Be(1);
    }

    [Fact]
    public void UpdateSafetyStatus_ShouldUpdateStatusAndSetUpdatedAt()
    {
        // Arrange
        var shortenedUrl = ShortenedUrl.Create(_validUrl, "abc").Value;
        var originalUpdatedAt = shortenedUrl.UpdatedAt;

        // Act
        shortenedUrl.UpdateSafetyStatus(UrlSafetyStatus.Danger);

        // Assert
        shortenedUrl.SafetyStatus.Should().Be(UrlSafetyStatus.Danger);
        shortenedUrl.UpdatedAt.Should().NotBe(originalUpdatedAt);
    }
}
