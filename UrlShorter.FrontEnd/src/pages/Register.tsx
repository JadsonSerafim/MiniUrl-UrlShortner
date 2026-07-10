import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { AuthForm } from '../components/AuthForm'
import { registerUser } from '../services/auth.service'
import type { ApiError } from '../types'

import { extractApiError } from '../utils/errorParser'
import { useTemporaryState } from '../hooks/useTemporaryState'

function PasswordToggle({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-body">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className={`input-base w-full pr-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors"
          tabIndex={-1}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [serverError, setServerError] = useTemporaryState<string | undefined>(undefined, 4000)

  const mutation = useMutation({
    mutationFn: () => registerUser({ name, email, password, acceptedTerms }),

    onSuccess: () => {
      navigate('/login', { replace: true })
    },

    onError: (err: AxiosError<ApiError>) => {
      setServerError(extractApiError(err))
    },
  })

  const handleSubmit = () => {
    setServerError(undefined)

    if (!name.trim()) {
      setServerError('O nome é obrigatório.')
      return
    }
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
    if (password.length < 6) {
      setServerError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setServerError('As senhas não coincidem.')
      return
    }
    if (!acceptedTerms) {
      setServerError('Voce precisa aceitar os Termos de Uso e a Politica de Privacidade.')
      return
    }

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
      ]}
      onSubmit={handleSubmit}
      footerText="Já tem conta?"
      footerLink="/login"
      footerLinkText="Entrar"
    >
      <PasswordToggle
        id="password"
        label="Senha"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
      />
      <PasswordToggle
        id="confirm-password"
        label="Confirmar senha"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="••••••••"
      />
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-hairline text-primary focus:ring-primary/30 cursor-pointer"
        />
        <span className="text-xs text-muted leading-relaxed group-hover:text-body transition-colors">
          Li e aceito os{' '}
          <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link to="/privacy" target="_blank" className="text-primary hover:underline font-medium">
            Politica de Privacidade
          </Link>
          .
        </span>
      </label>
    </AuthForm>
  )
}
