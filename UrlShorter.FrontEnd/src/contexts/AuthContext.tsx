import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: Omit<User, 'id'>) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

function parseToken(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null
    }
    
    return {
      id: (payload.sub || '') as string,
    }
  } catch (e) {
    return null
  }
}

function getInitialAuthState(): { token: string | null; user: User | null } {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (storedToken && storedUser) {
    const parsed = parseToken(storedToken)
    if (parsed) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        if (parsedUser.id !== parsed.id) {
          parsedUser.id = parsed.id
          localStorage.setItem('user', JSON.stringify(parsedUser))
        }
        return { token: storedToken, user: parsedUser }
      } catch (e) {
        console.error('Erro ao recuperar usuário do localStorage:', e)
      }
    }
  }

  // Se o token estiver expirado/inválido ou o JSON corrompido, limpa tudo
  if (storedToken || storedUser) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  return { token: null, user: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState(() => getInitialAuthState())

  const login = useCallback((newToken: string, userDetails: Omit<User, 'id'>) => {
    const parsed = parseToken(newToken)
    const id = parsed?.id || ''

    const newUser: User = { ...userDetails, id }

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    setAuthState({ token: newToken, user: newUser })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthState({ token: null, user: null })
  }, [])

  const { token, user } = authState

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

