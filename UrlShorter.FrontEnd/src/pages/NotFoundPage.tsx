import { Link, useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

export function NotFoundPage() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''

  return (
    <section className="mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full text-center p-8 border border-hairline bg-surface-soft backdrop-blur-md shadow-xl flex flex-col gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Link não encontrado</span>
          <h2 className="text-2xl font-bold text-ink tracking-tight">404 - Página Não Encontrada</h2>
          <p className="text-sm text-muted leading-relaxed">
            Não encontramos nenhum link ativo correspondente ao código{' '}
            {code && <span className="font-mono text-primary font-semibold">({code})</span>}. 
            Verifique se digitou o endereço corretamente.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Link to="/" className="w-full">
            <Button variant="primary" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
          <Link to="/login" className="text-xs text-muted hover:text-ink transition-colors font-medium">
            Entrar no Painel
          </Link>
        </div>
      </Card>
    </section>
  )
}
