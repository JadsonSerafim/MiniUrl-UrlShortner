import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LinkButton from '../components/LinkButton'

export function RootLayout() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

          {/* Wordmark */}
          <LinkButton to={isAuthenticated ? "/dashboard" : "/"} variant="ghost" className="text-primary font-semibold text-base px-0 hover:bg-transparent">
            UrlShorter
          </LinkButton>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
