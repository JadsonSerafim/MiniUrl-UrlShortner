import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implementar na Fase 2
  }

  return (
    <>
      <h1 className="mb-8 text-center text-2xl font-bold text-white">Criar conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-gray-400">
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-gray-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-gray-400">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
        >
          Cadastrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300">
          Entrar
        </Link>
      </p>
    </>
  )
}
