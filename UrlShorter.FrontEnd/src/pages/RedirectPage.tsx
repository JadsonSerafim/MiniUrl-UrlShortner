import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

export function RedirectPage() {
  const [searchParams] = useSearchParams()
  const target = searchParams.get('target') || ''
  const reason = searchParams.get('reason') || ''
  const [countdown, setCountdown] = useState(5)

  const isDanger = reason === 'danger'

  useEffect(() => {
    if (!target) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      window.location.href = target
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [target])

  const handleManualRedirect = () => {
    window.location.href = target
  }

  if (!target) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full text-center p-8 border border-hairline bg-surface-soft backdrop-blur-md shadow-xl flex flex-col gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-ink tracking-tight">Link Inválido</h2>
                <p className="text-sm text-muted leading-relaxed">Não foi possível identificar o destino deste redirecionamento.</p>
            </div>
        </Card>
      </section>
    )
  }

  if (isDanger) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full text-center p-8 border border-hairline bg-surface-soft backdrop-blur-md shadow-xl flex flex-col gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-500">Perigo Detectado</span>
            <h2 className="text-2xl font-bold text-ink tracking-tight">Tem certeza que deseja prosseguir?</h2>
            <p className="text-sm text-muted leading-relaxed">
              Esta URL <span className="font-semibold text-red-500">não passou</span> em nossas validações de segurança e pode ser <span className="font-semibold text-red-500">maliciosa</span>.
              Prosseguir pode colocar seus dados em risco.
            </p>
            <div className="mt-4 p-3 bg-canvas/50 rounded-lg border border-red-500/20 break-all">
              <span className="text-xs font-mono text-red-500">{target}</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Button onClick={handleManualRedirect} variant="primary" className="w-full bg-red-600 hover:bg-red-700 border-red-600">
              Prosseguir mesmo assim ({countdown > 0 ? countdown + 's' : '...'})
            </Button>
            <button 
              onClick={() => window.history.back()}
              className="text-xs text-muted hover:text-ink transition-colors font-medium"
            >
              Voltar para segurança
            </button>
          </div>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full text-center p-8 border border-hairline bg-surface-soft backdrop-blur-md shadow-xl flex flex-col gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Aviso de Segurança</span>
          <h2 className="text-2xl font-bold text-ink tracking-tight">Você está sendo redirecionado</h2>
          <p className="text-sm text-muted leading-relaxed">
            Este link foi encurtado por um <span className="font-semibold">Visitante</span> ou aponta para um <span className="font-semibold">domínio recente</span>. 
            Sempre verifique o destino antes de prosseguir.
          </p>
          <div className="mt-4 p-3 bg-canvas/50 rounded-lg border border-hairline break-all">
            <span className="text-xs font-mono text-primary">{target}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Button onClick={handleManualRedirect} variant="primary" className="w-full">
            Prosseguir agora ({countdown > 0 ? countdown + 's' : '...'})
          </Button>
          <button 
            onClick={() => window.history.back()}
            className="text-xs text-muted hover:text-ink transition-colors font-medium"
          >
            Voltar para segurança
          </button>
        </div>
      </Card>
    </section>
  )
}
