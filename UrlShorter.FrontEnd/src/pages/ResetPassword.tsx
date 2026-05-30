import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import Card from "../components/Card"
import { AuthForm } from "../components/AuthForm"
import { resetPassword } from "../services/auth.service"
import type { ApiError } from "../types"
import { extractApiError } from "../utils/errorParser"
import { useTemporaryState } from "../hooks/useTemporaryState"

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState(location.state?.email || "")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [serverError, setServerError] = useTemporaryState<string | undefined>(undefined, 4000)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => resetPassword({ email, code, newPassword, confirmPassword }),
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
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
    if (!code.trim() || code.trim().length !== 6) {
      setServerError('O código de 6 dígitos é obrigatório.')
      return
    }
    if (!newPassword) {
      setServerError('A nova senha é obrigatória.')
      return
    }
    if (newPassword.length < 6) {
      setServerError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setServerError('As senhas não conferem.')
      return
    }

    mutation.mutate()
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm mx-auto text-center p-8 border border-emerald-500/20 bg-surface/50 backdrop-blur-md flex flex-col gap-4 items-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-ink tracking-tight">Senha Redefinida!</h2>
          <p className="text-sm text-body">Sua senha foi atualizada com sucesso. Você já pode entrar.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Redirecionando para login...
        </div>
      </Card>
    )
  }

  return (
    <AuthForm
      title="Redefinir Senha"
      buttonText="Alterar Senha"
      loading={mutation.isPending}
      error={serverError}
      fields={[
        {
          name: "email",
          label: "E-mail",
          type: "email",
          value: email,
          onChange: setEmail,
          placeholder: "seu@email.com",
        },
        {
          name: "code",
          label: "Código de 6 dígitos",
          type: "text",
          value: code,
          onChange: setCode,
          placeholder: "123456",
        },
        {
          name: "newPassword",
          label: "Nova Senha",
          type: "password",
          value: newPassword,
          onChange: setNewPassword,
          placeholder: "••••••••",
        },
        {
          name: "confirmPassword",
          label: "Confirmar Nova Senha",
          type: "password",
          value: confirmPassword,
          onChange: setConfirmPassword,
          placeholder: "••••••••",
        },
      ]}
      onSubmit={handleSubmit}
      footerText="Voltar para"
      footerLink="/login"
      footerLinkText="Login"
    />
  )
}