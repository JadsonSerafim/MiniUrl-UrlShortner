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

interface StoredUserData {
  id: string
  name: string
}

function getInitialAuthState(): User | null {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser) as StoredUserData
      return { id: parsed.id, name: parsed.name, email: '' }
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
    const storedData: StoredUserData = { id: userDetails.id, name: userDetails.name }
    localStorage.setItem('user', JSON.stringify(storedData))
    setUser(userDetails)
  }, [])

  const logout = useCallback(async () => {
    try {
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
