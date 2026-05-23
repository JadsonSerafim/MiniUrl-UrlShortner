import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useClipboard } from '../hooks/useClipboard'
import { shortenUrl } from '../services/url.service'
import type { ApiError } from '../types'
import Card from './Card'
import Input from './Input'
import Button from './Button'

import { extractApiError } from '../utils/errorParser'

interface UrlShortenerProps {
  userId?: string
  label?: string
  buttonText?: string
}

export default function UrlShortener({
  userId,
  label = 'Encurte seu link gratuitamente',
  buttonText = 'Encurtar',
}: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const { copied, copy } = useClipboard()
  const queryClient = useQueryClient()

  // Constrói a URL completa para redirecionamento direto no back-end
  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const generatedShortUrl = shortCode ? `${backendBaseUrl}/${shortCode}` : ''

  const mutation = useMutation({
    mutationFn: () =>
      shortenUrl({
        originalUrl,
        userId,
      }),
    onSuccess: (code) => {
      setShortCode(code)
      setErrorMsg(undefined)
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['userUrls', userId] })
      }
    },
    onError: (err: AxiosError<ApiError>) => {
      setErrorMsg(
        extractApiError(err, 'Não foi possível encurtar a URL. Verifique o link enviado.')
      )
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
    <div className="w-full flex flex-col gap-6">
      <Card className="w-full text-left">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <Input
              label={label}
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
            {buttonText}
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
              <span>
                Destino:{' '}
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline truncate max-w-xs inline-block align-bottom hover:text-body"
                >
                  {originalUrl}
                </a>
              </span>
              <a
                href={generatedShortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Testar link ↗
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
