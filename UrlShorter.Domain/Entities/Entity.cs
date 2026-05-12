using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Domain.Entities;

public abstract class Entity
{

    private readonly List<IDomainEvent> _domainEvents = new();
    public Guid Id { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public bool IsActive { get; private set; } = true;


    protected Entity(Guid id, DateTime createdAt)
    {
        Id = id;
        CreatedAt = createdAt;
    }

    protected Entity()
    {
        Id = Guid.CreateVersion7();
        CreatedAt = DateTime.UtcNow;
    }

    public void AddDomainEvent(IDomainEvent domainEvent)
    {
         _domainEvents.Add(domainEvent);
    }
    public void RemoveDomainEvent(IDomainEvent domainEvent)
    {
         _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    protected void Update()
    {
        UpdatedAt = DateTime.UtcNow;
    }
    public void Deactivate()
    {
        if (!IsActive)
            throw new InvalidOperationException("Entidade já está desativada.");
        IsActive = false;
        Update();
    }

    public void Reactivate()
    {
        if (IsActive)
            throw new InvalidOperationException("Entidade já está ativa.");
        IsActive = true;
        Update();
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Entity other) return false;
        if (ReferenceEquals(this, other)) return true;
        if (Id == Guid.Empty || other.Id == Guid.Empty) return false;

        return Id == other.Id;
    }

    public override int GetHashCode() => Id.GetHashCode();

    public static bool operator ==(Entity? a, Entity? b) => a?.Equals(b) ?? b is null;
    public static bool operator !=(Entity? a, Entity? b) => !(a == b);


}