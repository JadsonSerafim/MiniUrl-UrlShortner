import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useClipboard } from '../hooks/useClipboard'
import { shortenUrl } from '../services/url.service'
import type { ApiError } from '../types'

import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

export function Home() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const { copied, copy } = useClipboard()

  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const generatedShortUrl = shortCode ? `${backendBaseUrl}/${shortCode}` : ''

  const mutation = useMutation({
    mutationFn: () =>
      shortenUrl({
        originalUrl,
        // Encurtamento público (guest), sem userId
      }),
    onSuccess: (code) => {
      setShortCode(code)
      setErrorMsg(undefined)
    },
    onError: (err: AxiosError<ApiError>) => {
      const messages = Object.values(err.response?.data?.errors ?? {}).flat()
      setErrorMsg(messages[0] ?? 'Não foi possível encurtar a URL. Verifique o link enviado.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl.trim()) return
    setShortCode(null)
    setErrorMsg(undefined)
    mutation.mutate()
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24 flex flex-col gap-20">
      
      {/* ── Seção Principal (Hero + Encurtador Público) ────────────────── */}
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

        {/* Box Encurtador */}
        <Card className="w-full text-left">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <Input
                label="Encurte seu link gratuitamente"
                type="url"
                placeholder="https://exemplo.com/sua-url-gigante-aqui"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              loading={mutation.isPending}
              className="w-full sm:w-auto h-12 px-6"
            >
              Encurtar
            </Button>
          </form>

          {errorMsg && (
            <p className="text-sm text-red-400 mt-3 animate-fade-in" role="alert">
              {errorMsg}
            </p>
          )}

          {/* Resultado do link encurtado */}
          {shortCode && (
            <div className="mt-6 border-t border-hairline pt-6 animate-fade-in">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                Link pronto!
              </h3>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={generatedShortUrl}
                  className="input-mono flex-1 bg-canvas border-hairline"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                
                <Button
                  variant="primary"
                  onClick={() => copy(generatedShortUrl)}
                  className="sm:w-auto"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>Destino: <a href={originalUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-xs inline-block align-bottom hover:text-body">{originalUrl}</a></span>
                <a href={generatedShortUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Testar link ↗</a>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Seção "Como funciona" ─────────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        <h2 className="text-xl sm:text-title-lg text-ink text-center tracking-tight">
          Como funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Card compact className="card-interactive flex flex-col gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-xs font-semibold text-primary">
              1
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Cole sua URL</h3>
              <p className="text-sm text-body">
                Cole a sua URL longa no campo acima. Não precisa estar logado para encurtar o link inicial.
              </p>
            </div>
          </Card>

          {/* Card 2 */}
          <Card compact className="card-interactive flex flex-col gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-xs font-semibold text-primary">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Gere um link curto</h3>
              <p className="text-sm text-body">
                Nós geraremos uma URL única, curta e elegante baseada no nosso sistema de shortcodes.
              </p>
            </div>
          </Card>

          {/* Card 3 */}
          <Card compact className="card-interactive flex flex-col gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-xs font-semibold text-primary">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Redirecionamento automático</h3>
              <p className="text-sm text-body">
                Todos que clicarem no seu link encurtado serão automaticamente redirecionados para a página original.
              </p>
            </div>
          </Card>

        </div>
      </div>

    </section>
  )
}
