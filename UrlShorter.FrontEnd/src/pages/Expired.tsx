import { Link, useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

export function Expired() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''

  return (
    <section className="mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full text-center p-8 border border-red-500/10 bg-surface/30 backdrop-blur-md shadow-xl flex flex-col gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">Ops... Link Expirado</span>
          <h2 className="text-2xl font-bold text-ink tracking-tight">URL não está mais ativa</h2>
          <p className="text-sm text-muted leading-relaxed">
            Esta URL {code && <span className="font-mono text-primary font-semibold">({code})</span>} já atingiu o seu limite de tempo e expirou.
            Peça para o criador do link gerar um novo ou renovar este link.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Link to="/" className="w-full">
            <Button variant="primary" className="w-full">
              Encurtar outra URL
            </Button>
          </Link>
          <Link to="/login" className="text-xs text-muted hover:text-ink transition-colors font-medium">
            Fazer Login
          </Link>
        </div>
      </Card>
    </section>
  )
}
