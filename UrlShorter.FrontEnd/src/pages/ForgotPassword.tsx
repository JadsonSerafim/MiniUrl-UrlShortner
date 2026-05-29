import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { AuthForm } from "../components/AuthForm"
import { forgotPassword } from "../services/auth.service"
import type { ApiError } from "../types"
import { extractApiError } from "../utils/errorParser"
import { useTemporaryState } from "../hooks/useTemporaryState"

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [serverError, setServerError] = useTemporaryState<string | undefined>(undefined, 4000)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => forgotPassword({ email }),
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => {
        navigate("/reset-password", { state: { email } })
      }, 2000)
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
        <h2>E-mail Enviado!</h2>
        <p>Se o e-mail estiver cadastrado, você receberá um código de 6 dígitos em breve.</p>
        <p>Redirecionando...</p>
      </div>
    )
  }

  return (
    <AuthForm
      title="Esqueci a Senha"
      buttonText="Enviar Código"
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
      ]}
      onSubmit={handleSubmit}
      footerText="Lembrou a senha?"
      footerLink="/login"
      footerLinkText="Entrar"
    />
  )
}