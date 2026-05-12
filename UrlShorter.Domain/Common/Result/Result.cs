namespace UrlShorter.Domain.Common.Result;

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }
    
    
    protected Result(bool isSuccess, Error error)
    {
        if (isSuccess && error != Error.None)
            throw new InvalidOperationException("Success result cannot contain error.");

        if (!isSuccess && error == Error.None)
            throw new InvalidOperationException("Failure result must contain error.");

        IsSuccess = isSuccess;
        Error = error;
    }


    public static Result Success() => new(true, Error.None);

    public static Result Failure(Error error) => new(false, error);

    public static implicit operator Result(Error error) => Failure(error);
}