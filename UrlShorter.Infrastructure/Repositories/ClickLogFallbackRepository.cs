using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using UrlShorter.Application.UseCases.ShortenedUrls.Queries.GetOriginalUrl;

namespace UrlShorter.Infrastructure.Repositories;

public class ClickLogFallbackRepository
{
    private readonly string _connectionString;

    // Se não passarmos nada, ele cria um arquivo chamado fallback_clicks.db na raiz do projeto
    public ClickLogFallbackRepository(string connectionString = "Data Source=fallback_clicks.db")
    {
        _connectionString = connectionString;
        InitializeDatabase();
    }

    private void InitializeDatabase()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        // SQL puro! O SQLite aceita tipos simples como TEXT e INTEGER
        const string sql = @"
            CREATE TABLE IF NOT EXISTS FallbackClicks (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                ShortCode TEXT NOT NULL,
                IpAddress TEXT,
                UserAgent TEXT,
                OccurredAt TEXT NOT NULL
            );";

        // Aqui está a mágica do Dapper: um método de extensão que executa o SQL direto na conexão!
        connection.Execute(sql);
    }

    public async Task<IEnumerable<ClickEvent>> GetAllAndClearAsync()
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();
        
        // 1. Buscamos todos os registros
        const string selectSql = @"
            SELECT ShortCode, IpAddress, UserAgent, OccurredAt 
            FROM FallbackClicks;";
            
        var events = await connection.QueryAsync<ClickEvent>(selectSql);
        
        // 2. Limpamos a tabela para não reprocessar
        const string deleteSql = "DELETE FROM FallbackClicks;";
        await connection.ExecuteAsync(deleteSql);
        
        return events;
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
