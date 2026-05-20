import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RootLayout() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-800">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-white">
            UrlShorter
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
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
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700"
                >
                  Cadastrar
                </Link>
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
