using FluentValidation;

namespace UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

public class GetOriginalUrlValidator : AbstractValidator<GetOriginalUrlQuery>
{
    public GetOriginalUrlValidator()
    {
        RuleFor(x => x.ShortCode)
            .NotEmpty().WithMessage("O ShortCode não pode ser vazio.");
    }
}
