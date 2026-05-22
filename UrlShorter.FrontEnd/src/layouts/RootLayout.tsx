import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LinkButton from '@/components/LinkButton'

export function RootLayout() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-800">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <LinkButton
            to="/"
            variant='ghost'
            size='sm'
          >
            UrlShorter
          </LinkButton>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <LinkButton
                  to="/dashboard"
                  variant='ghost'
                  size='sm'
                >
                  Dashboard
                </LinkButton>
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button
                  onClick={logout}
                  className="rounded bg-gray-800 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <LinkButton
                  to="/login"
                  variant='ghost'
                  size='sm'
                >
                  Entrar
                </LinkButton>
                <LinkButton
                  to="/register"
                  variant='primary'
                  size='sm'
                >
                  Cadastrar
                </LinkButton>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
