namespace UrlShorter.Application.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetCodeAsync(string toEmail, string userName, string code);
}
