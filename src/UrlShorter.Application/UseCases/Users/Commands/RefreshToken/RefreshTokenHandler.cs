using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Application.UseCases.Users.Commands.Login;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Application.UseCases.Users.Commands.RefreshToken;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenProvider _tokenProvider;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenHandler(IUserRepository userRepository, ITokenProvider tokenProvider, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenProvider = tokenProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<LoginResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(request.RefreshToken, cancellationToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return ErrorsUser.TokenInvalidOrExpired;
        }

        var token = _tokenProvider.Generate(user);
        
        var newRefreshToken = Guid.NewGuid().ToString();
        user.UpdateRefreshToken(newRefreshToken, DateTime.UtcNow.AddDays(7));

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponse(user.Id, user.Name, user.Email.Value, newRefreshToken, token);
    }
}
