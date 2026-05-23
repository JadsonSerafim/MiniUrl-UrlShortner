import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { AuthForm } from '../components/AuthForm'
import { loginUser } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import type { ApiError } from '../types'

import { extractApiError } from '../utils/errorParser'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState<string | undefined>()

  const mutation = useMutation({
    mutationFn: () => loginUser({ email, password }),

    onSuccess: (data) => {
      login(data.token.token, {
        name:  data.name,
        email,
      })
      navigate('/dashboard', { replace: true })
    },

    onError: (err: AxiosError<ApiError>) => {
      setServerError(extractApiError(err))
    },
  })

  const handleSubmit = () => {
    setServerError(undefined)
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
    />
  )
}
