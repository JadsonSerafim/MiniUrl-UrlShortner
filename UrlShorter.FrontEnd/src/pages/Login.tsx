import { useState } from 'react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
      
  }

  return (
    <AuthForm
      title =  "Entrar"
      buttonText = "Entrar"
      fields={[
        { name: 'email', label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'seu@email.com' },
        { name: 'password', label: 'Senha', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
      ]}
      onSubmit={handleSubmit}
      footerText="Não tem conta?"
      footerLink="/register"
      footerLinkText="Cadastre-se"
    />
  )
}
