import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useAuth } from '../contexts/AuthContext'
import { useClipboard } from '../hooks/useClipboard'
import { shortenUrl } from '../services/url.service'
import type { ApiError, UrlItem } from '../types'

import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

// URLs Fictícias (Mock) para o histórico
const MOCK_URLS: UrlItem[] = [
  {
    shortCode: 'xK92f',
    originalUrl: 'https://github.com/JadsonSerafim/UrlShorter/blob/main/DESIGN.md',
    createdAt: '22 de mai. de 2026',
  },
  {
    shortCode: 'yT41p',
    originalUrl: 'https://developer.coinbase.com/docs/cloud/styling-specifications',
    createdAt: '21 de mai. de 2026',
  },
  {
    shortCode: 'aB88z',
    originalUrl: 'https://tailwindcss.com/docs/customizing-colors-and-spacing',
    createdAt: '19 de mai. de 2026',
  },
]

export function Dashboard() {
  const { user } = useAuth()
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const { copied, copy } = useClipboard()

  // Constrói a URL completa para redirecionamento direto no back-end
  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const generatedShortUrl = shortCode ? `${backendBaseUrl}/${shortCode}` : ''

  const mutation = useMutation({
    mutationFn: () =>
      shortenUrl({
        originalUrl,
        userId: user?.id || undefined, // vincula ao usuário logado
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
    <section className="mx-auto max-w-4xl px-4 py-12 flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
        <p className="text-sm text-body mt-1">
          Bem-vindo de volta, <span className="text-ink font-semibold">{user?.name}</span>. Encurte seus links abaixo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Lado Esquerdo/Centro: Encurtador (2/3 colunas) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <h2 className="text-lg font-medium text-ink mb-4">Encurtar um novo link</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="URL Original"
                type="url"
                placeholder="https://exemplo.com/sua-pagina-longa"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />

              {errorMsg && (
                <p className="text-sm text-red-400 animate-fade-in" role="alert">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={mutation.isPending}
                className="self-end"
              >
                Encurtar Link
              </Button>
            </form>
          </Card>

          {/* Resultado do link encurtado */}
          {shortCode && (
            <Card className="border border-primary bg-primary/5 animate-fade-in">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
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

              <div className="mt-3 flex items-center justify-between text-xs text-body">
                <span>Destino original: <a href={originalUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-xs inline-block align-bottom hover:text-ink">{originalUrl}</a></span>
                <a href={generatedShortUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Testar link ↗</a>
              </div>
            </Card>
          )}
        </div>

        {/* Lado Direito: Histórico Mockado (1/3 coluna) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted px-1">
            Seus links recentes
          </h2>
          
          <div className="flex flex-col gap-3">
            {/* TODO: substituir por GET /api/urls quando o endpoint do backend estiver pronto */}
            {MOCK_URLS.map((item) => {
              const fullUrl = `${backendBaseUrl}/${item.shortCode}`
              return (
                <Card key={item.shortCode} compact className="card-interactive flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-mono truncate">{item.shortCode}</span>
                      <span className="text-xs text-muted">{item.createdAt}</span>
                    </div>
                    <p className="text-xs text-body truncate mt-1">
                      {item.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-hairline/50 pt-2">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted hover:text-ink transition-colors"
                    >
                      Acessar link ↗
                    </a>
                    
                    <button
                      onClick={() => copy(fullUrl)}
                      className="text-xs text-primary font-semibold hover:text-primary-active"
                    >
                      Copiar
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
