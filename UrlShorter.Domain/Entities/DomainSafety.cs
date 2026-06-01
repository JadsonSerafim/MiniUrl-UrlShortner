namespace UrlShorter.Domain.Entities;

public class DomainSafety : Entity
{
    public string DomainName { get; private set; }
    public DateTime DomainCreatedAt { get; private set; }
    public DateTime LastCheckedAt { get; private set; }

    private DomainSafety() 
    { 
        DomainName = null!; 
    }

    private DomainSafety(string domainName, DateTime domainCreatedAt)
    {
        DomainName = domainName.ToLowerInvariant();
        DomainCreatedAt = domainCreatedAt;
        LastCheckedAt = DateTime.UtcNow;
    }

    public static DomainSafety Create(string domainName, DateTime domainCreatedAt)
    {
        return new DomainSafety(domainName, domainCreatedAt);
    }

    public void UpdateLastChecked()
    {
        LastCheckedAt = DateTime.UtcNow;
        Update();
    }
    
    public int GetDomainAgeInDays()
    {
        return (DateTime.UtcNow - DomainCreatedAt).Days;
    }
}
