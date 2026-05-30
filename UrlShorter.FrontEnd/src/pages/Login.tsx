import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { AuthForm } from '../components/AuthForm'
import { loginUser } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import type { ApiError } from '../types'

import { extractApiError } from '../utils/errorParser'
import { useTemporaryState } from '../hooks/useTemporaryState'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useTemporaryState<string | undefined>(undefined, 4000)

  const mutation = useMutation({
    mutationFn: () => loginUser({ email, password }),

    onSuccess: (data) => {
      login({
        id: data.id,
        name: data.name,
        email: data.email,
      })
      navigate('/dashboard', { replace: true })
    },

    onError: (err: AxiosError<ApiError>) => {
      setServerError(extractApiError(err))
    },
  })

  const handleSubmit = () => {
    setServerError(undefined)

    if (!email.trim()) {
      setServerError('O email é obrigatório.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setServerError('Insira um email válido.')
      return
    }
    if (!password) {
      setServerError('A senha é obrigatória.')
      return
    }

    mutation.mutate()
  }

  return (
    <AuthForm
      title="Entrar"
      buttonText="Entrar"
      loading={mutation.isPending}
      error={serverError}
      fields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          value: email,
          onChange: setEmail,
          placeholder: 'seu@email.com',
        },
        {
          name: 'password',
          label: 'Senha',
          type: 'password',
          value: password,
          onChange: setPassword,
          placeholder: '••••••••',
        },
      ]}
      onSubmit={handleSubmit}
      footerText="Não tem conta?"
      footerLink="/register"
      footerLinkText="Cadastre-se"
      extraLink="/forgot-password"
      extraLinkText="Esqueceu a senha?"
    />
  )
}