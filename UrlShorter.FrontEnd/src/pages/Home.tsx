import UrlShortener from '../components/UrlShortener'
import StepCard from '../components/StepCard'

export function Home() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24 flex flex-col gap-20">
      
      {/* Hero + Encurtador Público */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-10">
        
        {/* Headlines */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-display-sm md:text-display-md text-ink font-light tracking-tight">
            Links encurtados,{' '}
            <span className="text-primary font-normal">
              resultados simplificados.
            </span>
          </h1>
          <p className="text-base sm:text-body-md text-body max-w-xl mx-auto">
            Encurte suas URLs instantaneamente de forma pública ou crie uma conta para gerenciar seus links.
          </p>
        </div>

        {/* Componente Encurtador Público */}
        <UrlShortener
          label="Encurte seu link gratuitamente"
          buttonText="Encurtar"
        />
      </div>

      {/* Seção "Como funciona" */}
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
