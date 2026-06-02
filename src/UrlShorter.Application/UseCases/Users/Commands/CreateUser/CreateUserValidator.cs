using FluentValidation;

namespace UrlShorter.Application.UseCases.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.")
            .MinimumLength(3).WithMessage("O nome deve ter pelo menos 3 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("O formato do e-mail é inválido.")
            .MaximumLength(100).WithMessage("O e-mail deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(8).WithMessage("A senha deve ter pelo menos 8 caracteres.")
            .MaximumLength(64).WithMessage("A senha deve ter no máximo 64 caracteres.")
            .Must(x => x.Any(char.IsUpper)).WithMessage("A senha deve conter pelo menos uma letra maiúscula.")
            .Must(x => x.Any(char.IsLower)).WithMessage("A senha deve conter pelo menos uma letra minúscula.")
            .Must(x => x.Any(char.IsDigit)).WithMessage("A senha deve conter pelo menos um número.")
            .Must(x => x.Any(c => !char.IsLetterOrDigit(c))).WithMessage("A senha deve conter pelo menos um caractere especial.");
    }
}
