using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;

namespace UrlShorter.Domain.Entities;

public class PasswordResetToken : Entity
{
    public Guid UserId { get; private set; }
    public string Code { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public bool IsUsed { get; private set; }

    private PasswordResetToken(Guid userId, string code, DateTime expiresAt) : base()
    {
        UserId = userId;
        Code = code;
        ExpiresAt = expiresAt;
        IsUsed = false;
    }

    private PasswordResetToken()
    {
        Code = "";
        ExpiresAt = DateTime.MinValue;
    }

    public static PasswordResetToken Create(Guid userId)
    {
        var code = Random.Shared.Next(100000, 999999).ToString();
        var expiresAt = DateTime.UtcNow.AddMinutes(15);

        return new PasswordResetToken(userId, code, expiresAt);
    }

    public Result Consume()
    {
        if (IsUsed)
            return Result.Failure(ErrorsPasswordResetToken.AlreadyUsed);
        if (DateTime.UtcNow > ExpiresAt)
            return Result.Failure(ErrorsPasswordResetToken.Expired);
        IsUsed = true;
        Update();
        return Result.Success();
    }
}
