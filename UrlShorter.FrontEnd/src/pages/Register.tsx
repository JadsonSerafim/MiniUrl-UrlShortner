import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { AuthForm } from '../components/AuthForm'
import { registerUser } from '../services/auth.service'
import type { ApiError } from '../types'

import { extractApiError } from '../utils/errorParser'

export function Register() {
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState<string | undefined>()

  const mutation = useMutation({
    mutationFn: () => registerUser({ name, email, password }),

    onSuccess: () => {
      // Cadastro feito — redireciona para login
      navigate('/login', { replace: true })
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
      title="Criar conta"
      buttonText="Cadastrar"
      loading={mutation.isPending}
      error={serverError}
      fields={[
        {
          name: 'name',
          label: 'Nome',
          type: 'text',
          value: name,
          onChange: setName,
          placeholder: 'Seu nome',
        },
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
      footerText="Já tem conta?"
      footerLink="/login"
      footerLinkText="Entrar"
    />
  )
}
