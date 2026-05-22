import { useState } from 'react'
import { AuthForm } from '../components/AuthForm'

export function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    // TODO Task 3: integrar POST /api/users
  }

  return (
    <AuthForm
      title="Criar conta"
      buttonText="Cadastrar"
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
