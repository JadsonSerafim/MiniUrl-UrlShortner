import { Link } from 'react-router-dom'

export function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
        Links encurtados,{' '}
        <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          resultados ampliados
        </span>
      </h1>

      <p className="mb-8 max-w-xl text-lg text-gray-400">
        Crie links curtos e acompanhe o desempenho em tempo real.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
        >
          Começar agora
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 hover:border-gray-500 hover:text-white"
        >
          Entrar
        </Link>
      </div>
    </section>
  )
}
