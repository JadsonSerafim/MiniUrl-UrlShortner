import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = () => {
    
  }

  return (
      
      <AuthForm 
      title = "Criar conta"
          ButtonText = "Cadastrar"
          fields={[
            { name: 'name', label: 'Nome', type: 'text', value: name, onChange: setName, placeholder: 'Seu nome' },
            { name: 'email', label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'seu@email.com' },
            { name: 'password', label: 'Senha', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
          ]}
          onSubmit={handleSubmit}
          footerText="Já tem conta?"
          footerLink="/login"
          footerLinkText="Entrar" 
      
      />
  )
}
