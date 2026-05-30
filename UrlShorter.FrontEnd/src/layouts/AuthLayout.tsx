import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:py-24">
      <div className="w-full max-w-sm animate-fade-in">
        <Outlet />
      </div>
    </div>
  )
}
