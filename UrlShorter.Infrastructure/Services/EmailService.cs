using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MimeKit;
using UrlShorter.Application.Interfaces;

namespace UrlShorter.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    public async Task SendPasswordResetCodeAsync(string toEmail, string userName, string code)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromAddress));
        email.To.Add(new MailboxAddress(userName, toEmail));
        email.Subject = "Redefinição de Senha - UrlShorter";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"""
                <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #2563eb;'>Redefinição de Senha</h2>
                    <p>Olá, <strong>{userName}</strong>!</p>
                    <p>Você solicitou a redefinição de sua senha no UrlShorter. Utilize o código abaixo para prosseguir:</p>
                    <div style='background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e40af; border-radius: 8px;'>
                        {code}
                    </div>
                    <p>Este código expira em 15 minutos.</p>
                    <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
                    <hr style='border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;'>
                    <p style='font-size: 12px; color: #6b7280;'>Equipe UrlShorter</p>
                </div>
                """
        };

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(
                _emailSettings.SmtpServer,
                _emailSettings.SmtpPort,
                SecureSocketOptions.Auto);

            if (!string.IsNullOrWhiteSpace(_emailSettings.SmtpUser))
            {
                await smtp.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
            }

            await smtp.SendAsync(email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar e-mail de recuperação de senha para {Email}", toEmail);
            throw;
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}