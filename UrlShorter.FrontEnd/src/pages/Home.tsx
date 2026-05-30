import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UrlShortener from '../components/UrlShortener'
import StepCard from '../components/StepCard'
import Card from '../components/Card'

export function Home() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24 flex flex-col gap-20">

      <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-10">

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-display-sm md:text-display-md text-ink font-light tracking-tight">
            Encurtador de URLs
          </h1>
          <p className="text-base sm:text-body-md text-body max-w-xl mx-auto">
            Gere URLs curtas de forma gratuita, ou cadastre-se para ter links permanentes e monitorar seus acessos.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full text-left max-w-5xl mx-auto">
        <div className="md:col-span-2">
          <UrlShortener
            label="Encurte seu link gratuitamente"
            buttonText="Encurtar"
          />
        </div>

        <Card className="border border-primary/20 bg-surface/50 backdrop-blur-sm p-6 flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Projeto de Portfólio
          </h3>
          <p className="text-xs text-body leading-relaxed">
            Não deixe URLs críticas aqui, o sistema é self-hosted em um mini PC e como
            visitante anônimo, seus links encurtados expiram em 24h.
          </p>
          <a
            href="https://github.com/JadsonSerafim/UrlShorter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary-active font-semibold transition-colors mt-2 inline-flex items-center gap-1"
          >
            Saiba mais sobre a infra ↗
          </a>
        </Card>
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-xl sm:text-title-lg text-ink text-center tracking-tight">
          Como funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            stepNumber={1}
            title="Cole sua URL"
            description="Cole a sua URL longa no campo acima. Não precisa estar logado para encurtar o link inicial."
          />
          <StepCard
            stepNumber={2}
            title="Gere um link curto"
            description="Nós geraremos uma URL única, curta e elegante baseada no nosso sistema de shortcodes."
          />
          <StepCard
            stepNumber={3}
            title="Redirecionamento automático"
            description="Todos que clicarem no seu link encurtado serão automaticamente redirecionados para a página original."
          />
        </div>
      </div>

    </section>
  )
}
