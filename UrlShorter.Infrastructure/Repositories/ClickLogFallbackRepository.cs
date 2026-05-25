using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

namespace UrlShorter.Infrastructure.Repositories;

public class ClickLogFallbackRepository
{
    private readonly string _connectionString;

    public ClickLogFallbackRepository(string connectionString = "Data Source=fallback_clicks.db")
    {
        _connectionString = connectionString;
        InitializeDatabase();
    }

    private void InitializeDatabase()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        const string sql = @"
            CREATE TABLE IF NOT EXISTS FallbackClicks (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                ShortCode TEXT NOT NULL,
                IpAddress TEXT,
                UserAgent TEXT,
                OccurredAt TEXT NOT NULL
            );";

        connection.Execute(sql);
    }

    public async Task<IEnumerable<ClickEvent>> GetAllAndClearAsync()
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();
        
        const string selectSql = @"
            SELECT ShortCode, IpAddress, UserAgent, OccurredAt 
            FROM FallbackClicks;";
            
        var clickDtos = await connection.QueryAsync<FallbackClickDto>(selectSql);
        
        const string deleteSql = "DELETE FROM FallbackClicks;";
        await connection.ExecuteAsync(deleteSql);
        
        return clickDtos.Select(d => new ClickEvent(d.ShortCode, d.IpAddress, d.UserAgent, d.OccurredAt));
    }

    public async Task SaveRangeAsync(IEnumerable<ClickEvent> events)
    {
        if (events == null || !events.Any()) return;

        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = @"
            INSERT INTO FallbackClicks (ShortCode, IpAddress, UserAgent, OccurredAt)
            VALUES (@ShortCode, @IpAddress, @UserAgent, @OccurredAt);";

        await connection.ExecuteAsync(sql, events);
    }
}
