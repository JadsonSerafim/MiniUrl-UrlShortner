# Projeto UrlShorter - Análise e Diretrizes

Este documento serve como a "memória" e o guia de arquitetura para o projeto UrlShorter. Ele deve ser atualizado conforme o projeto evolui.

## 🏗️ Arquitetura
O projeto segue os princípios da **Clean Architecture**, dividido nas seguintes camadas:

1.  **UrlShorter.Domain**: O núcleo do projeto. Contém as regras de negócio, entidades (`ShortenedUrl`), Value Objects (`Url`), interfaces de repositórios e o padrão de `Result` para tratamento de erros.
2.  **UrlShorter.Application**: Contém os casos de uso da aplicação (Use Cases). Atualmente em fase de scaffold.
3.  **UrlShorter.Infrastructure**: Implementações de persistência (EF Core), serviços externos e integração com banco de dados. Atualmente em fase de scaffold.
4.  **UrlShorter.API**: Ponto de entrada da aplicação, contendo os Controllers e a configuração do pipeline do ASP.NET Core.

## 🧩 Padrões de Projeto e Regras de Negócio
- **Result Pattern**: Utilizado para evitar exceções em fluxos de negócio. As operações retornam `Result` ou `Result<T>`.
- **Value Objects**: A classe `Url` garante que qualquer URL no sistema seja válida e siga os esquemas permitidos (http/https).
- **Factory Methods**: Entidades como `ShortenedUrl` usam métodos estáticos `Create` para garantir que o objeto seja sempre criado em um estado válido.

## 🚀 Estado Atual (Roadmap de Tutoria)
O projeto possui o domínio bem definido, mas as camadas de aplicação e infraestrutura precisam de implementação:
- [ ] Implementar `ShortenedUrlRepository` na camada de `Infrastructure`.
- [ ] Configurar EF Core e `DbContext`.
- [ ] Criar casos de uso na camada de `Application` (ex: `CreateShortenedUrl`, `GetUrlByCode`).
- [ ] Configurar Injeção de Dependência nas classes `DependencyInjection.cs`.
- [ ] Implementar os Controllers na `API`.

## 🎓 Diretrizes de Tutoria
- **Papel**: Atuar exclusivamente como tutor. Explicar o "porquê" antes do "como".
- **Interação**: Não escrever código diretamente nos arquivos de implementação, a menos que solicitado para exemplificação.
- **Foco**: Guiar o usuário na implementação dos padrões SOLID e Clean Architecture.
