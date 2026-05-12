namespace UrlShorter.Domain.Interfaces;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}