using UrlShorter.Domain.Entities;
using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Common;

public abstract class AggregateRoot : Entity, IAggregateRoot
{
    protected AggregateRoot() { }

    protected AggregateRoot(Guid id, DateTime createdAt) : base(id, createdAt) { }
}