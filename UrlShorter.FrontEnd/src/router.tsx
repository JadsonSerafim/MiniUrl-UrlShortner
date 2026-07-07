import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Navigate } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedLayout } from './layouts/ProtectedLayout'

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Expired = lazy(() => import('./pages/Expired').then(m => ({ default: m.Expired })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const RedirectPage = lazy(() => import('./pages/RedirectPage').then(m => ({ default: m.RedirectPage })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sobre', element: <About /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'infra', element: <Navigate to="/sobre?tab=infra" replace /> },
      { path: 'redirect', element: <RedirectPage /> },
      { path: 'expired', element: <Expired /> },
      { path: 'not-found', element: <NotFoundPage /> },

      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ],
      },

      {
        element: <ProtectedLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
])