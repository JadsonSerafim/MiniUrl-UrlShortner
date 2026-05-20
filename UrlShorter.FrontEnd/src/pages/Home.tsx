import LinkButton from '../components/LinkButton'

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
        <LinkButton
          to="/register"
          variant='primary'
          size='lg'
        >
          Começar agora
        </LinkButton>
        <LinkButton
          to="/login"
          variant='secondary'
          size='lg'
        >
          Entrar
        </LinkButton>
      </div>
    </section>
  )
}
