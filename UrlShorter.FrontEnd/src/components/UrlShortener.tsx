import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useClipboard } from '../hooks/useClipboard'
import { shortenUrl } from '../services/url.service'
import type { ApiError } from '../types'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import ExpirationSelector from './ExpirationSelector'

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

  const [expirationType, setExpirationType] = useState<'1d' | '7d' | '30d' | '365d' | 'custom'>('30d')
  const [customValue, setCustomValue] = useState<number | ''>(1)
  const [customUnit, setCustomUnit] = useState<'hours' | 'days'>('days')

  const { copied, copy } = useClipboard()
  const queryClient = useQueryClient()

  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const generatedShortUrl = shortCode ? `${backendBaseUrl}/${shortCode}` : ''

  const getExpiresAtDate = (): string | undefined => {
    if (!userId) return undefined

    const now = new Date()
    switch (expirationType) {
      case '1d':
        now.setDate(now.getDate() + 1)
        return now.toISOString()
      case '7d':
        now.setDate(now.getDate() + 7)
        return now.toISOString()
      case '30d':
        now.setDate(now.getDate() + 30)
        return now.toISOString()
      case '365d':
        now.setDate(now.getDate() + 365)
        return now.toISOString()
      case 'custom':
        const val = customValue === '' ? 1 : customValue
        if (customUnit === 'days') {
          now.setDate(now.getDate() + val)
        } else {
          now.setHours(now.getHours() + val)
        }
        return now.toISOString()
      default:
        return undefined
    }
  }

  const mutation = useMutation({
    mutationFn: () =>
      shortenUrl({
        originalUrl,
        userId,
        expiresAt: getExpiresAtDate(),
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

    if (userId && expirationType === 'custom' && customValue === '') {
      setErrorMsg('O tempo de validade personalizado é obrigatório.')
      return
    }

    setShortCode(null)
    setErrorMsg(undefined)
    mutation.mutate()
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="w-full text-left">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-end gap-3">
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
          </div>

          {userId && (
            <ExpirationSelector
              value={expirationType}
              onChange={setExpirationType}
              customValue={customValue}
              onChangeCustomValue={setCustomValue}
              customUnit={customUnit}
              onChangeCustomUnit={setCustomUnit}
            />
          )}
        </form>

        {errorMsg && (
          <p className="text-sm text-red-400 mt-3 animate-fade-in" role="alert">
            {errorMsg}
          </p>
        )}

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

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center justify-between text-xs text-muted min-w-0">
              <span className="truncate">
                Destino:{' '}
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-body"
                >
                  {originalUrl}
                </a>
              </span>
              <a
                href={generatedShortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline shrink-0"
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
