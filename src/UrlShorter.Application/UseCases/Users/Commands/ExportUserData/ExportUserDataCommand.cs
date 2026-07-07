using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.UseCases.Users.Commands.ExportUserData;

public record ExportUserDataCommand(Guid UserId) : IRequest<Result<ExportUserDataResponse>>;
