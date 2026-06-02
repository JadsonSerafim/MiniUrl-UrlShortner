using UrlShorter.Domain.Interfaces;

namespace UrlShorter.Infrastructure.Services;

public class ShortCodeGenerator : IShortCodeGenerator
{

    private const string Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static readonly int Base = Alphabet.Length;
    
    public string Generate(int length = 6)
    {
        long number = Math.Abs(Random.Shared.NextInt64());

        return Encode(number, length);
    }

    private static string Encode(long number, int length)
    {
        var result = new char[length];

        int index = length - 1;

        while (index >= 0)
        {
            result[index] = Alphabet[(int)(number % Base)];

            number /= Base;

            index--;

        }
        return new string(result);
    }
}