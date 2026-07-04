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
            <LinkButton
              to={isAuthenticated ? "/dashboard" : "/"}
              variant="ghost"
              className="text-primary font-semibold text-base px-0 hover:bg-transparent flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200 fill-none" viewBox="0 0 72 72" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M31.7356,42.1428c-.869,2.5155-1.12,4.3475-1.7985,5.5912a2.1933,2.1933,0,0,1-2.582,1.0226,47.1968,47.1968,0,0,0-6.2064-1.455,2.15,2.15,0,0,1-.6908-.2417c-4.0951-2.2435-8.509-3.4083-9.4579-2.4594a2.3467,2.3467,0,0,0-.7764,2.9644c.7646,2.2938,7.2284,5.2139,8.5651,6.728l5.849,5.8491S31.61,65.0583,35.435,65.0372C47.4984,64.9708,54.9871,49.2418,55,45.4723a21.652,21.652,0,0,0-.2793-3.2872,19.0358,19.0358,0,0,0-.7777-3.0063" />
                <path d="M24.5042,35.6935l-8.5093,2.0318a3.4311,3.4311,0,0,1-4.429-2.0319c-.1935-1.8834.4621-2.4049,1.8585-3.39a6.0112,6.0112,0,0,1,1.1023-.4777l9.6243-3.05a3.6991,3.6991,0,0,1,1.8252-.0553" />
                <line x1="31.7356" x2="24.6377" y1="42.1428" y2="35.7709" />
                <path d="M25.01,28.6125a4.3334,4.3334,0,0,1,2.349.6306,3.4038,3.4038,0,0,1,.787.6513l8.3294,6.694" />
                <path d="M32.4365,29.9218,25.01,15.2084c-.875-2.0782-1.511-3.5464,0-4.687,1.511-1.15,2.9907-.3613,4.141,1.15.156.2047,8.5493,13.0158,11.0839,17.2661v.01" />
                <path d="M48.0929,31.395C46.7086,25.8774,42.0178,10.1967,41.93,9.9724a2.7784,2.7784,0,0,0-3.4342-2.0532c-1.7839.6727-2.02,2.6907-1.7391,4.4594l.9758,6.6879" />
                <path d="M47.4,18.5064c.1188-1.9068.6442-3.596,2.2763-3.7827a2.4638,2.4638,0,0,1,2.5623,1.4977,5.272,5.272,0,0,1,.5568,2.1762c.2324,3.92,1.1653,20.2393,1.1653,20.2393a3.2433,3.2433,0,0,1-.0292.5362" />
                <line x1="39.6751" x2="43.1657" y1="28.0814" y2="33.5938" />
                <circle cx="18" cy="24" r="5.5" fill="currentColor" stroke="none" />
              </svg>
              <span className="tracking-tight">MiniUrl</span>
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
              href="https://github.com/JadsonSerafim/MiniUrl-UrlShortner"
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

            <a
              href="https://www.linkedin.com/in/jadson-serafim/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-hairline hover:bg-surface-soft transition-all duration-150 flex items-center justify-center cursor-pointer outline-none text-body hover:text-ink font-normal"
              title="Ver perfil no LinkedIn"
              aria-label="Link do LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-ink">
              <svg className="w-4 h-4 text-primary fill-none animate-pulse" viewBox="0 0 72 72" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M31.7356,42.1428c-.869,2.5155-1.12,4.3475-1.7985,5.5912a2.1933,2.1933,0,0,1-2.582,1.0226,47.1968,47.1968,0,0,0-6.2064-1.455,2.15,2.15,0,0,1-.6908-.2417c-4.0951-2.2435-8.509-3.4083-9.4579-2.4594a2.3467,2.3467,0,0,0-.7764,2.9644c.7646,2.2938,7.2284,5.2139,8.5651,6.728l5.849,5.8491S31.61,65.0583,35.435,65.0372C47.4984,64.9708,54.9871,49.2418,55,45.4723a21.652,21.652,0,0,0-.2793-3.2872,19.0358,19.0358,0,0,0-.7777-3.0063" />
                <path d="M24.5042,35.6935l-8.5093,2.0318a3.4311,3.4311,0,0,1-4.429-2.0319c-.1935-1.8834.4621-2.4049,1.8585-3.39a6.0112,6.0112,0,0,1,1.1023-.4777l9.6243-3.05a3.6991,3.6991,0,0,1,1.8252-.0553" />
                <line x1="31.7356" x2="24.6377" y1="42.1428" y2="35.7709" />
                <path d="M25.01,28.6125a4.3334,4.3334,0,0,1,2.349.6306,3.4038,3.4038,0,0,1,.787.6513l8.3294,6.694" />
                <path d="M32.4365,29.9218,25.01,15.2084c-.875-2.0782-1.511-3.5464,0-4.687,1.511-1.15,2.9907-.3613,4.141,1.15.156.2047,8.5493,13.0158,11.0839,17.2661v.01" />
                <path d="M48.0929,31.395C46.7086,25.8774,42.0178,10.1967,41.93,9.9724a2.7784,2.7784,0,0,0-3.4342-2.0532c-1.7839.6727-2.02,2.6907-1.7391,4.4594l.9758,6.6879" />
                <path d="M47.4,18.5064c.1188-1.9068.6442-3.596,2.2763-3.7827a2.4638,2.4638,0,0,1,2.5623,1.4977,5.272,5.272,0,0,1,.5568,2.1762c.2324,3.92,1.1653,20.2393,1.1653,20.2393a3.2433,3.2433,0,0,1-.0292.5362" />
                <line x1="39.6751" x2="43.1657" y1="28.0814" y2="33.5938" />
                <circle cx="18" cy="24" r="5.5" fill="currentColor" stroke="none" />
              </svg>
              <span>MiniUrl</span>
            </div>
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
              href="https://www.linkedin.com/in/jadson-serafim/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/JadsonSerafim/MiniUrl-UrlShortner"
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
