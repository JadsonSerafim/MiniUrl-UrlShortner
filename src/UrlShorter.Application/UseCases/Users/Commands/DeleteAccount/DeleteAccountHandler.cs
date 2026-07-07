using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Application.UseCases.Users.Commands.DeleteAccount;

public class DeleteAccountHandler : IRequestHandler<DeleteAccountCommand, Result>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public DeleteAccountHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return ErrorsUser.NotFound;
        }

        var anonymizedEmail = Email.Create($"deleted_{user.Id}@removed.invalid").Value;
        var anonymizedPassword = Password.Create(Guid.NewGuid().ToString(), _passwordHasher).Value;

        user.AnonymizePersonalData(anonymizedEmail, anonymizedPassword);
        user.Deactivate();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
