using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.ValueObjects;

namespace UrlShorter.Domain.Entities;

public sealed class User : Entity
{
    public Email Email { get; private set; }
    public string Name { get; private set; }

    private User() { } // Necessário para o EF Core

    private User(Email email, string name)
    {
        Email = email;
        Name = name;
    }

    public static Result<User> Create(Email email, string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return ErrorsUser.NameEmpty;

        return new User(email, name);
    }

    public void UpdateName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName)) return;
        Name = newName;
        Update();
    }
}
