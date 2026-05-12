# CleanArch-UrlShorter

UrlShorter de **Clean Architecture** em **.NET 10** pronto para uso e customização.

## Estrutura

```
src/
├── UrlShorter.Domain/          # Entidades, ValueObjects, Enums, Events, Interfaces
├── UrlShorter.Application/     # UseCases, Services, Interfaces
├── UrlShorter.Infrastructure/  # EF Core, Repositórios, Migrations, Persistence
└── UrlShorter.API/             # Controllers, Middlewares, Hubs (SignalR)
```

## Stack

- .NET 10
- Entity Framework Core 10
- JWT Bearer Authentication
- SignalR
- Swagger
- BCrypt

> **Nota:** Este urlshorter foi simplificado e não inclui por padrão MediatR ou FluentValidation, permitindo uma arquitetura mais direta ou a escolha de outras bibliotecas de sua preferência.

## Como instalar o UrlShorter

Para utilizar este projeto como um urlshorter oficial no seu sistema e no Rider:

### 1. Pelo Terminal (.NET CLI)
Na raiz deste projeto, execute:
```bash
dotnet new install .
```

### 2. Pelo JetBrains Rider
1. Abra o Rider e vá em **File | New Solution**.
2. No menu lateral, clique em **More UrlShorters**.
3. Clique em **Install UrlShorter...** e selecione a pasta raiz deste projeto.
4. O urlshorter **Clean Architecture UrlShorter** aparecerá na lista de projetos disponíveis.

## Como usar

1. Crie um novo projeto usando o urlshorter (via Rider ou `dotnet new cleanarch -n MeuProjeto`).
2. O Rider substituirá automaticamente o termo `UrlShorter` pelo nome do seu projeto em todos os namespaces e arquivos.
3. Configure a connection string no `appsettings.json`.
4. Remova os arquivos `.gitkeep` conforme for adicionando sua lógica de negócio.
