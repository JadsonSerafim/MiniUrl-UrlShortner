import LinkButton from '../components/LinkButton'
import Card from '../components/Card'

export function About() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16 flex flex-col gap-12 animate-fade-in">

      <header className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <span className="badge self-center bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
          Sobre o Projeto
        </span>
        <h1 className="text-3xl sm:text-display-sm text-ink font-light tracking-tight">
          UrlShorter
        </h1>
        <p className="text-base sm:text-body-md text-body leading-relaxed">
          Encurtador de URLs criado como projeto pessoal de estudo.
        </p>
      </header>

      
      <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-ink">
            Código-fonte Aberto
          </h3>
          <p className="text-sm text-body max-w-xl">
            Este é um projeto pessoal desenvolvido para fins de portfólio. O código é totalmente aberto e está disponível no GitHub.
            Por ser uma demonstração hospedada em infraestrutura própria (self-hosted), pedimos que não utilize o serviço para encurtar URLs críticas.
          </p>
        </div>
        <a
          href="https://github.com/JadsonSerafim/UrlShorter"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center gap-2 text-sm font-semibold shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Ver Repositório
        </a>
      </Card>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink">Backend (.NET 10)</h2>
              <p className="text-xs text-muted">C# • Clean Architecture • DDD</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3 text-sm text-body leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>Clean Architecture & DDD:</strong> Divisão bem definida de camadas (Domain, Application, Infrastructure, API) isolando a lógica de negócio principal de acoplamentos externos.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>CQRS & MediatR:</strong> Padrão Command Query Responsibility Segregation isolando fluxos de leitura e escrita para máxima manutenibilidade.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>Pipeline de Validação:</strong> FluentValidation acoplado ao pipeline do MediatR via Behaviors para validação automática de dados.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>Processamento Assíncrono:</strong> buffering e fila em memória com <code>System.Threading.Channels</code> para persistência assíncrona de logs de acesso sem atrasar o usuário.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>Persistência Poliglota:</strong> Banco de dados relacional PostgreSQL via Entity Framework Core e cache de redirecionamento via Redis (Padrão Cache-Aside).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">✓</span>
              <span><strong>Controle de Abuso:</strong> Rate limiting para visitantes com middleware customizado e limite de URLs ativas para usuários autenticados.</span>
            </li>
          </ul>
        </Card>

        
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink">Frontend (React 19)</h2>
              <p className="text-xs text-muted">Vite • TypeScript • Tailwind CSS</p>
            </div>
          </div>

          <p className="text-sm text-body leading-relaxed">
            SPA construída com React 19 e TypeScript, utilizando TanStack Query para gerenciamento de estado do servidor,
            react-router-dom para roteamento protegido por autenticação, e um design system customizado com Tailwind CSS
            com suporte a temas claro e escuro.
          </p>

          <div className="flex flex-wrap gap-2">
            {['React 19', 'TypeScript', 'Vite', 'TanStack Query', 'Axios', 'react-router-dom', 'Tailwind CSS'].map(tech => (
              <span key={tech} className="badge">{tech}</span>
            ))}
          </div>
        </Card>

      </section>

      
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-ink text-center tracking-tight">
          Arquitetura de Fluxo de Clique
        </h2>
        <Card className="p-6 text-sm text-body flex flex-col gap-4">
          <p>
            Um dos grandes diferenciais do projeto é o sistema de rastreamento assíncrono e resiliente. Quando alguém clica em um link encurtado:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-soft border border-hairline">
              <div className="text-xs font-bold text-primary">PASSO 1</div>
              <h4 className="font-semibold text-ink text-sm">Cache-Aside Redirection</h4>
              <p className="text-xs">A API do encurtador bate primeiramente no Redis para encontrar o link de redirecionamento. O usuário é redirecionado instantaneamente (302) sem tocar no banco PostgreSQL.</p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-soft border border-hairline">
              <div className="text-xs font-bold text-primary">PASSO 2</div>
              <h4 className="font-semibold text-ink text-sm">System.Threading.Channels</h4>
              <p className="text-xs">As informações do clique (User-Agent, IP, ShortCode) são publicadas instantaneamente em um canal em memória sem bloquear a resposta HTTP do usuário final.</p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-soft border border-hairline">
              <div className="text-xs font-bold text-primary">PASSO 3</div>
              <h4 className="font-semibold text-ink text-sm">Background Worker & Fallback</h4>
              <p className="text-xs">Um serviço de background consome o canal, agrupa os cliques em lotes (batching) e os salva de forma assíncrona no PostgreSQL. Se o banco principal falhar, o lote é salvo em um banco local SQLite para processamento posterior.</p>
            </div>
          </div>
        </Card>
      </section>

      
      <div className="flex justify-center gap-4 mt-4">
        <LinkButton to="/" variant="secondary">
          Voltar ao Início
        </LinkButton>
        <LinkButton to="/login" variant="primary">
          Acessar Dashboard
        </LinkButton>
      </div>

    </article>
  )
}
