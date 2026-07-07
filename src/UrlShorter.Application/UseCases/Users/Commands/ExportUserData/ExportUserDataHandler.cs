using MediatR;
using UrlShorter.Domain.Common.Result;
using UrlShorter.Domain.Common.Result.Errors;
using UrlShorter.Domain.Interfaces;
using UrlShorter.Domain.Repositories;

namespace UrlShorter.Application.UseCases.Users.Commands.ExportUserData;

public class ExportUserDataHandler : IRequestHandler<ExportUserDataCommand, Result<ExportUserDataResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IShortenedUrlRepository _shortenedUrlRepository;

    public ExportUserDataHandler(
        IUserRepository userRepository,
        IShortenedUrlRepository shortenedUrlRepository)
    {
        _userRepository = userRepository;
        _shortenedUrlRepository = shortenedUrlRepository;
    }

    public async Task<Result<ExportUserDataResponse>> Handle(ExportUserDataCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return ErrorsUser.NotFound;
        }

        var urls = await _shortenedUrlRepository.GetAllUserUrlsAsync(request.UserId, cancellationToken);

        var userData = new UserData(
            user.Id,
            user.Name,
            user.Email.Value,
            user.CreatedAt,
            user.ConsentGivenAt
        );

        var urlDataList = urls.Select(u => new UrlData(
            u.ShortCode,
            u.OriginalUrl.Value,
            u.Name,
            u.ClickCount,
            u.ExpiresAt,
            u.CreatedAt
        )).ToList();

        var response = new ExportUserDataResponse(
            userData,
            urlDataList,
            DateTime.UtcNow
        );

        return Result<ExportUserDataResponse>.Success(response);
    }
}
