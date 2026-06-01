import { Suspense } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import LinkButton from '../components/LinkButton'

export function RootLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-pill focus:text-sm focus:font-semibold focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex w-full max-w-5xl h-16 items-center justify-between px-6 rounded-xl border border-hairline bg-canvas/90 backdrop-blur-sm shadow-soft">

          <div className="flex items-center gap-6">
            <LinkButton to={isAuthenticated ? "/dashboard" : "/"} variant="ghost" className="text-primary font-semibold text-base px-0 hover:bg-transparent">
              UrlShorter
            </LinkButton>
            <Link to="/sobre" className="text-sm font-medium text-body hover:text-ink transition-colors hidden sm:inline-block">
              Sobre o Projeto
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/sobre" className="text-sm font-medium text-body hover:text-ink transition-colors sm:hidden">
              Sobre
            </Link>

            <a
              href="https://github.com/JadsonSerafim/UrlShorter"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-hairline hover:bg-surface-soft transition-all duration-150 flex items-center justify-center cursor-pointer outline-none text-body hover:text-ink font-normal"
              title="Ver repositório no GitHub"
              aria-label="Link do GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-ghost p-0 w-9 h-9 rounded-full border border-hairline hover:bg-surface-soft transition-all duration-150 flex items-center justify-center cursor-pointer outline-none"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              aria-label="Alternar tema"
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-xs text-muted hidden sm:block">{user?.name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="btn-secondary text-sm h-9 px-4"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <LinkButton to="/login" variant="ghost" size="sm">
                  Entrar
                </LinkButton>
                <LinkButton to="/register" variant="primary" size="sm">
                  Cadastrar
                </LinkButton>
              </>
            )}
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-1 pt-24">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      <footer className="w-full border-t border-hairline bg-surface/30 py-8 mt-16">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-sm font-semibold text-ink">UrlShorter</span>
            <span className="text-xs text-muted">© {new Date().getFullYear()} — Projeto de Portfólio.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-body">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="hover:text-ink transition-colors">
              Início
            </Link>
            <Link to="/sobre" className="hover:text-ink transition-colors">
              Sobre o Projeto
            </Link>
            <a
              href="https://github.com/JadsonSerafim/UrlShorter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
