using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.ValueObjects;

public sealed record Password
{
    public string Value { get; } // Aqui guardamos o HASH

    private Password(string value) => Value = value;


    public static Result<Password> Create(string plainTextPassword, IPasswordHasher hasher)
    {
        if (string.IsNullOrWhiteSpace(plainTextPassword))
            return ErrorsUser.PasswordEmpty;

        if (plainTextPassword.Length < 8 || plainTextPassword.Length > 64)
            return ErrorsPassword.InvalidLength;


        if(!plainTextPassword.Any(char.IsDigit))
            return ErrorsPassword.NoDigit;

        if (!plainTextPassword.Any(char.IsLetter))
            return ErrorsPassword.NoLetter;
            
        if(!plainTextPassword.Any(char.IsUpper))
            return ErrorsPassword.NoUpper;
        
        if(!plainTextPassword.Any(char.IsLower))
            return ErrorsPassword.Invalid;

        return new Password(hasher.Hash(plainTextPassword));
    }

    public static Result<Password> CreateFromHash(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
            return ErrorsUser.PasswordEmpty;

        return new Password(hash);
    }

    public static Result<Password> LoadFromHash(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
            return ErrorsUser.PasswordEmpty;

        return new Password(hash);
    }

    public static implicit operator string(Password password) => password.Value;
}
