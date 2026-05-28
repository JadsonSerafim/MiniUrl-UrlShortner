using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Domain.Entities;

public sealed class User : Entity
{
    public Email Email { get; private set; }
    public string Name { get; private set; }

    public Password Password { get; private set; }

    private User() 
    {
        Email = null!;
        Name = null!;
        Password = null!;
    }

    private User(Email email, string name, Password password)
    {
        Email = email;
        Name = name;
        Password = password;
    }

    public static Result<User> Create(Email email, string name, Password password)
    {
        if (string.IsNullOrWhiteSpace(name))
            return ErrorsUser.NameEmpty;

        return new User(email, name, password);
    }

    public void UpdateName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName)) return;
        Name = newName;
        Update();
    }

    public Result UpdatePassword(string oldPassword, string newPassword, IPasswordHasher hasher)
    {
        if (!hasher.Verify(oldPassword, Password.Value))
            return Result.Failure(Error.Validation("Password.Mismatch", "A senha atual está incorreta."));

        if (oldPassword == newPassword)
            return Result.Failure(Error.Validation("Password.Same", "A senha atual é a mesma que a nova senha."));

        var passwordResult = Password.Create(newPassword, hasher);
        if (passwordResult.IsFailure)
            return passwordResult;

        Password = passwordResult.Value;
        Update();
        return Result.Success();
    }
    
    public Result ResetPassword(string newPassword, IPasswordHasher hasher)
    {
        var passwordResult = Password.Create(newPassword, hasher);
        if(passwordResult.IsFailure)
            return passwordResult;
        Password = passwordResult.Value;
        Update();
        return Result.Success();
    }


    public void UpdateEmail(Email newEmail)
    {
        Email = newEmail;
        Update();
    }
}
