using FluentValidation;
using MediatR;
using UrlShorter.Domain.Common.Result;

namespace UrlShorter.Application.Common.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse>
: IPipelineBehavior<TRequest, TResponse>
where TRequest : IRequest<TResponse>
where TResponse : Result
{

    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request,
    RequestHandlerDelegate<TResponse> next,
    CancellationToken cancellationToken)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);

        var validationFailures = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var errors = validationFailures
        .SelectMany(result => result.Errors)
        .Where(f => f != null)
        .Select(f => Error.Validation(f.ErrorCode, f.ErrorMessage))
        .Distinct()
        .ToArray();

        if (errors.Any())
        {
            return CreateValidationResult<TResponse>(errors);
        }
        return await next();
    }

    private static TResponse CreateValidationResult<TResult>(Error[] errors) where TResult : Result
    {
        var validationError = ValidationError.FromResults(errors);

        if (typeof(TResult) == typeof(Result))
        {
            return (validationError as TResponse)!;
        }

        var resultType = typeof(TResult);
        var valueType = resultType.GetGenericArguments()[0];

        var failureMethod = typeof(Result<>)
        .MakeGenericType(valueType)
        .GetMethod(nameof(Result.Failure), new[] { typeof(Error) });

        object validationResult = failureMethod.Invoke(null, new[] { validationError })!;

        return (TResponse)validationResult;
    }
}