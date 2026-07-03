import { Link, useSearchParams } from 'react-router-dom'
import LinkButton from '../components/LinkButton'
import Card from '../components/Card'
import { Infrastructure } from './Infrastructure'

export function About() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'infra' ? 'infra' : 'project'

  const setActiveTab = (tab: 'project' | 'infra') => {
    setSearchParams({ tab })
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16 flex flex-col gap-10 animate-fade-in">

      <header className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <span className="badge self-center bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
          {activeTab === 'project' ? 'Sobre o Projeto' : 'Infraestrutura & Homelab'}
        </span>
        <h1 className="text-3xl sm:text-display-sm text-ink font-light tracking-tight">
          {activeTab === 'project' ? 'MiniUrl' : 'Infraestrutura'}
        </h1>
        <p className="text-base sm:text-body-md text-body leading-relaxed">
          {activeTab === 'project'
            ? 'Encurtador de URLs criado como projeto pessoal de estudo.'
            : 'Detalhes do hardware próprio e da orquestração de containers deste homelab.'}
        </p>
      </header>

      {/* Tabs Selector */}
      <div className="flex justify-center -mt-2">
        <div className="flex p-1 rounded-xl bg-surface-soft border border-hairline backdrop-blur-sm gap-1">
          <button
            onClick={() => setActiveTab('project')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer outline-none ${
              activeTab === 'project'
                ? 'bg-surface text-primary shadow-soft border border-hairline'
                : 'text-muted hover:text-ink border border-transparent'
            }`}
          >
            Sobre o Projeto
          </button>
          <button
            onClick={() => setActiveTab('infra')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer outline-none ${
              activeTab === 'infra'
                ? 'bg-surface text-primary shadow-soft border border-hairline'
                : 'text-muted hover:text-ink border border-transparent'
            }`}
          >
            Infraestrutura
          </button>
        </div>
      </div>

      {activeTab === 'project' ? (
        <div className="flex flex-col gap-10 animate-fade-in">
          <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-ink">
                Código-fonte Aberto
              </h3>
              <p className="text-sm text-body max-w-xl">
                Este é um projeto pessoal desenvolvido para fins de portfólio. O código é totalmente aberto e está disponível no GitHub.
                Por ser uma demonstração hospedada em infraestrutura própria (self-hosted), pedimos que não utilize o serviço para encurtar URLs críticas. Acesse para{' '}
                <button
                  onClick={() => setActiveTab('infra')}
                  className="text-primary hover:underline font-semibold cursor-pointer bg-transparent border-0 p-0 outline-none inline"
                >
                  Conhecer Infraestrutura do projeto
                </button>.
              </p>
            </div>
            <a
              href="https://github.com/JadsonSerafim/MiniUrl-UrlShortner"
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
                  <span><strong>Clean Architecture & DDD:</strong> Separação do projeto em camadas (Domain, Application, Infrastructure, API) isolando a lógica de negócio principal de acoplamentos externos.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span><strong>CQRS & MediatR:</strong> Padrão Command Query Responsibility Segregation isolando fluxos de leitura e escrita.</span>
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
                  <span><strong>Cache side Pattern:</strong> Cache de redirecionamento via Redis e banco de dados relacional PostgreSQL via Entity Framework Core.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span><strong>Controle de Abuso:</strong> Rate limiting para visitantes e controle de URLs ativas para usuários autenticados.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span><strong>Verificadores de Segurança:</strong> Análise de URLs criadas contra malware e phishing via Google Safe Browsing, DNS Blocklists (SURBL/Spamhaus), além de prevenção contra loops e domínios recentes.</span>
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

              <p className="text-sm text-body leading-relaxed flex-1">
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
        </div>
      ) : (
        <Infrastructure showHeader={false} />
      )}

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <LinkButton to="/" variant="secondary">
          Voltar ao Início
        </LinkButton>
        {activeTab === 'project' ? (
          <button
            onClick={() => setActiveTab('infra')}
            className="btn-secondary text-base h-11 px-5 inline-flex items-center justify-center font-semibold cursor-pointer outline-none"
          >
            Conhecer Infraestrutura
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('project')}
            className="btn-secondary text-base h-11 px-5 inline-flex items-center justify-center font-semibold cursor-pointer outline-none"
          >
            Sobre o Projeto
          </button>
        )}
        <LinkButton to="/login" variant="primary">
          Acessar Dashboard
        </LinkButton>
      </div>

    </article>
  )
}
