using FluentAssertions;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.ValueObjects;
using Xunit;

namespace UrlShorter.Domain.UnitTests;

public class UrlTests
{
    [Theory]
    [InlineData("https://google.com")]
    [InlineData("http://myblog.com/posts/1")]
    public void Create_ShouldReturnSuccess_WhenUrlIsValid(string validUrl)
    {
        // Act
        var result = Url.Create(validUrl);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(validUrl);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Create_ShouldReturnFailure_WhenUrlIsEmpty(string? emptyUrl)
    {
        // Act
        var result = Url.Create(emptyUrl!);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.Empty);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenUrlIsInvalidFormat()
    {
        // Act
        var result = Url.Create("not-a-url");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.InvalidFormat);
    }

    [Fact]
    public void Create_ShouldReturnFailure_WhenSchemeIsInvalid()
    {
        // Act
        var result = Url.Create("ftp://files.com");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.HttpInvalid);
    }

    [Theory]
    [InlineData("http://localhost")]
    [InlineData("https://127.0.0.1")]
    [InlineData("http://192.168.1.1")]
    [InlineData("http://10.0.0.5")]
    [InlineData("http://172.16.50.1")]
    public void Create_ShouldReturnFailure_WhenUrlIsLocalOrPrivate(string localUrl)
    {
        // Act
        var result = Url.Create(localUrl);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.RestrictedTarget);
    }

    [Theory]
    [InlineData("https://site.tk")]
    [InlineData("https://virus.zip")]
    [InlineData("https://scam.mov")]
    [InlineData("https://free.top")]
    public void Create_ShouldReturnFailure_WhenTldIsMalicious(string maliciousUrl)
    {
        var result = Url.Create(maliciousUrl);

        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.MaliciousTld);
    }

    [Theory]
    [InlineData("https://bit.ly/123")]
    [InlineData("https://www.tinyurl.com/abc")]
    [InlineData("http://jadson.dev.br/teste")]
    public void Create_ShouldReturnFailure_WhenDomainIsBlockedShortener(string blockedUrl)
    {
        // Act
        var result = Url.Create(blockedUrl);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ErrorsUrl.ChainRedirectForbidden);
    }
}
