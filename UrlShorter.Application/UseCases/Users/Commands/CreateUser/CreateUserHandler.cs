using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.Users.Commands.CreateUser;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, Result<CreateUserResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUserRepository _userRepository;

    public CreateUserHandler(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher, IUserRepository userRepository)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _userRepository = userRepository;
    }

    public async Task<Result<CreateUserResponse>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {

        var isEmailUnique = await _userRepository.IsEmailUniqueAsync(request.Email, cancellationToken);
        if (!isEmailUnique)
        {
            return ErrorsEmail.AlreadyExists;
        }

        var emailResult = Email.Create(request.Email);
        if (emailResult.IsFailure)
        {
            return emailResult.Error;
        }

        var passwordResult = Password.Create(request.Password, _passwordHasher);
        if (passwordResult.IsFailure)
        {
            return passwordResult.Error;
        }

        var userResult = User.Create(emailResult.Value, request.Name, passwordResult.Value);
        if (userResult.IsFailure) return userResult.Error;

        var user = userResult.Value;

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateUserResponse(user.Id, user.Email.Value, user.Name);


    }
}
