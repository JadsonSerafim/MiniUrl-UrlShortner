namespace UrlShorter.Domain.Interfaces;

public interface IShortCodeGenerator
{
    public string Generate(int length = 6);
}