using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.Users.Commands.ForgotPassword;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, Result>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenRepository _tokenRepository;
    private readonly IEmailService _emailService;
    private readonly IUnitOfWork _unitOfWork;

    public ForgotPasswordHandler(
        IUserRepository userRepository,
        IPasswordResetTokenRepository tokenRepository,
        IEmailService emailService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenRepository = tokenRepository;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
        {
            return Result.Success();
        }

        await _tokenRepository.InvalidateAllForUserAsync(user.Id);

        var token = PasswordResetToken.Create(user.Id);
        await _tokenRepository.AddAsync(token);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _ = _emailService.SendPasswordResetCodeAsync(user.Email.Value, user.Name, token.Code);

        return Result.Success();
    }
}