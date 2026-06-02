namespace UrlShorter.Domain.Common.Result;

public class Result<T> : Result
{
    private readonly T? _value;

    protected Result(T value) : base(true, Error.None)
    {
        _value = value;
    }

    protected Result(Error error) : base(false, error)
    {
        _value = default;
    }

    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Cannot access value of a failure result.");

    public static Result<T> Success(T value) => new(value);

    public static new Result<T> Failure(Error error) => new(error);

    public static implicit operator Result<T>(T value) => Success(value);

    public static implicit operator Result<T>(Error error) => Failure(error);

    public static explicit operator T(Result<T> result) => result.Value;
}