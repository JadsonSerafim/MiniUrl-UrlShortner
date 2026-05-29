import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

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
    mutation.mutate()
  }

  if (success) {
    return (
      <div className="auth-card success-message">
        <h2>Senha Redefinida!</h2>
        <p>Sua senha foi atualizada com sucesso. Você já pode entrar.</p>
        <p>Redirecionando para login...</p>
      </div>
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