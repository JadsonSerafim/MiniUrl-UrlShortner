# UrlShorter

Encurtador de URLs com autenticação, analytics e verificação de segurança. Desenvolvido em .NET 10 com React 19 no frontend.

## Funcionalidades

- Encurtamento de URLs com short codes únicos
- Autenticação JWT com refresh token rotation
- Dashboard com métricas de cliques por URL
- Expiração automática de links (1 dia para visitantes, configurável para usuários)
- Verificação de segurança contra domínios maliciosos (Google Safe Browsing, SpamHaus, SURBL)
- Cache com Redis para redirecionamentos rápidos
- Suporte a Docker Compose

## Stack

**Backend:** .NET 10, PostgreSQL, Redis, MediatR, FluentValidation, EF Core, SignalR
**Frontend:** React 19, TypeScript, Tailwind CSS, TanStack Query, Axios
**Infra:** Docker, GitHub Actions, Nginx

## Como rodar

```bash
# Subir tudo (PostgreSQL + Redis + API + Frontend)
docker compose up -d

# Ou rodar só o backend local
dotnet run --project src/UrlShorter.API

# Migrations
dotnet ef database update --project src/UrlShorter.Infrastructure --startup-project src/UrlShorter.API
```

## Projetos

```
src/
├── UrlShorter.Domain      — Entidades, Value Objects, Interfaces
├── UrlShorter.Application  — Casos de uso (CQRS), Validadores
├── UrlShorter.Infrastructure — EF Core, Redis, JWT, Serviços externos
└── UrlShorter.API          — Controllers, Middlewares
tests/
├── UrlShorter.Domain.UnitTests
├── UrlShorter.Application.UnitTests
├── UrlShorter.Infrastructure.UnitTests
└── UrlShorter.API.IntegrationTests
UrlShorter.FrontEnd/       — SPA React + TypeScript
```

## API

### URLs

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/urls` | Encurta uma URL |
| GET | `/{shortCode}` | Redireciona para URL original |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/users` | Cadastro |
| POST | `/api/users/login` | Login (retorna JWT) |
| POST | `/api/users/forgot-password` | Esqueci senha |
| POST | `/api/users/reset-password` | Redefinir senha |

## Design

O projeto segue Clean Architecture com CQRS e Domain-Driven Design. O resultado de operações é retornado via `Result<T>` — erros de domínio são expressos como objetos de erro, não exceções.
