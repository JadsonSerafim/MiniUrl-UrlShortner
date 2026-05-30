using MediatR;
using UrlShorter.Application.Interfaces;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.Users.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenProvider _tokenProvider;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    
    public LoginCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, ITokenProvider tokenProvider, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenProvider = tokenProvider;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null) 
            return ErrorsUser.InvalidCredentials;

        if (!_passwordHasher.Verify(request.Password, user.Password))
            return ErrorsUser.InvalidCredentials;
        
        var token = _tokenProvider.Generate(user);

        var refreshToken = Guid.NewGuid().ToString();
        user.UpdateRefreshToken(refreshToken, DateTime.UtcNow.AddDays(7));
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponse(user.Id, user.Name, user.Email.Value, refreshToken, token);
    }
}
