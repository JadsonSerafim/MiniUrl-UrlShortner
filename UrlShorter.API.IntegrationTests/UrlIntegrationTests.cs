using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using UrlShorter.Application.UseCases.ShortenedUrls.Commands.CreateShortenedUrl;
using UrlShorter.Infrastructure.Persistence;
using Xunit;
using Moq;

namespace UrlShorter.API.IntegrationTests;

[Collection("Sequential")]
public class UrlIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public UrlIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task ShortenUrl_Guest_ShouldReturnShortCode()
    {
        // Arrange
        var request = new CreateShortenedUrlCommand("https://google.com", null, null, null);

        // Act
        var response = await _client.PostAsJsonAsync("/api/urls", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var shortCode = await response.Content.ReadAsStringAsync();
        shortCode.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Redirect_ValidCode_ShouldReturnRedirect()
    {
        // Arrange
        // 1. First shorten a URL as a registered user (simulated by having a UserId in DB)
        // or just shorten as guest and mock interstitial to false (even if handler says true for guest)
        var originalUrl = "https://example.com";
        var shortenResponse = await _client.PostAsJsonAsync("/api/urls", new CreateShortenedUrlCommand(originalUrl, null, null, null));
        var shortCode = await shortenResponse.Content.ReadAsStringAsync();
        shortCode = shortCode.Trim('"');

        // Mock behavior: for this test, assume no interstitial is needed
        _factory.DomainSafetyMock.Setup(d => d.ShouldShowInterstitialAsync(originalUrl, It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var response = await _client.GetAsync($"/{shortCode}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        response.Headers.Location?.ToString().Should().Be(originalUrl + "/");
    }

    [Fact]
    public async Task Redirect_GuestUrl_ShouldRedirectToInterstitialPage()
    {
        // Arrange
        var originalUrl = "https://trusted-site.com";
        var shortenResponse = await _client.PostAsJsonAsync("/api/urls", new CreateShortenedUrlCommand(originalUrl, null, null, null));
        var shortCode = await shortenResponse.Content.ReadAsStringAsync();
        shortCode = shortCode.Trim('"');

        // Guest URL shortening means UserId is null. 
        // GetOriginalUrlHandler returns RequiresInterstitial = true for Guest.
        _factory.DomainSafetyMock.Setup(d => d.ShouldShowInterstitialAsync(originalUrl, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var response = await _client.GetAsync($"/{shortCode}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        var location = response.Headers.Location?.ToString();
        location.Should().Contain("/redirect?target=");
        location.Should().Contain(WebUtility.UrlEncode(originalUrl));
    }

    [Fact]
    public async Task ShortenUrl_LocalDomain_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new CreateShortenedUrlCommand("http://localhost", null, null, null);

        // Act
        var response = await _client.PostAsJsonAsync("/api/urls", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShortenUrl_GuestRateLimitExceeded_ShouldReturnTooManyRequests()
    {
        // Arrange
        var request = new CreateShortenedUrlCommand("https://google.com", null, null, null);
        var rateLimitClient = _factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        rateLimitClient.DefaultRequestHeaders.Add("X-Forwarded-For", "123.123.123.123");

        // Act
        // Send 5 successful requests
        for (int i = 0; i < 5; i++)
        {
            var okResponse = await rateLimitClient.PostAsJsonAsync("/api/urls", request);
            okResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        // The 6th request should be blocked
        var limitResponse = await rateLimitClient.PostAsJsonAsync("/api/urls", request);

        // Assert
        limitResponse.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);
    }
}
