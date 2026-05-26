import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import LinkButton from '../components/LinkButton'

export function RootLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Skip Link ──────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-pill focus:text-sm focus:font-semibold focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

          {/* Wordmark */}
          <LinkButton to={isAuthenticated ? "/dashboard" : "/"} variant="ghost" className="text-primary font-semibold text-base px-0 hover:bg-transparent">
            UrlShorter
          </LinkButton>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn-ghost p-0 w-9 h-9 rounded-full border border-hairline hover:bg-surface-soft transition-all duration-150 flex items-center justify-center cursor-pointer outline-none"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              aria-label="Alternar tema"
              aria-pressed={theme === 'light'}
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

      {/* ── Content ────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
