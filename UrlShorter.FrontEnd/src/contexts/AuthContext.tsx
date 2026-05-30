import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'
import { api } from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userDetails: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

function getInitialAuthState(): User | null {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User
    } catch (e) {
      console.error('Erro ao recuperar usuário do localStorage:', e)
      localStorage.removeItem('user')
    }
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getInitialAuthState())

  const login = useCallback((userDetails: User) => {
    localStorage.setItem('user', JSON.stringify(userDetails))
    setUser(userDetails)
  }, [])

  const logout = useCallback(async () => {
    try {
      // Chama a API para limpar o cookie HttpOnly
      await api.post('/users/logout')
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error)
    } finally {
      localStorage.removeItem('user')
      setUser(null)
      window.location.href = '/login'
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
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
