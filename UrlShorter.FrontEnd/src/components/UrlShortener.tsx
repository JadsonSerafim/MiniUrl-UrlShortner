import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClipboard } from '../hooks/useClipboard'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { shortenUrl } from '../services/url.service'
import type { ApiError } from '../types'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import ExpirationSelector from './ExpirationSelector'
import { extractApiError } from '../utils/errorParser'
import { shortenUrlSchema, getExpiresAtDate, type ShortenUrlFormValues } from '../schemas/url.schema'

interface UrlShortenerProps {
  userId?: string
  label?: string
  buttonText?: string
}

type FormValues = ShortenUrlFormValues

export default function UrlShortener({
  userId,
  label = 'Encurte seu link gratuitamente',
  buttonText = 'Encurtar',
}: UrlShortenerProps) {
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [submittedUrl, setSubmittedUrl] = useState<string>('')
  const [errorMsg, setErrorMsg] = useTemporaryState<string | undefined>(undefined, 4000)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(shortenUrlSchema),
    defaultValues: {
      originalUrl: '',
      expirationType: '30d',
      customValue: 1,
      customUnit: 'days',
    },
  })

  const expirationType = watch('expirationType')
  const customValue = watch('customValue')
  const customUnit = watch('customUnit')

  const { copied, copy } = useClipboard()
  const queryClient = useQueryClient()

  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const generatedShortUrl = shortCode ? `${backendBaseUrl}/${shortCode}` : ''

  const mutation = useMutation({
    mutationFn: ({ url, expiresAt }: { url: string; expiresAt?: string }) =>
      shortenUrl({
        originalUrl: url,
        userId,
        expiresAt,
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

  const onSubmit = (data: FormValues) => {
    setShortCode(null)
    setErrorMsg(undefined)
    setSubmittedUrl(data.originalUrl)

    setValue('originalUrl', data.originalUrl)

    mutation.mutate({
      url: data.originalUrl,
      expiresAt: getExpiresAtDate(data, userId),
    })
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="w-full text-left">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <Input
                  label={label}
                  placeholder="https://exemplo.com/sua-url-gigante-aqui"
                  error={errors.originalUrl?.message}
                  hideErrorText={true}
                  {...register('originalUrl')}
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

            {errors.originalUrl?.message && (
              <p className="text-xs text-red-400 animate-fade-in px-1" role="alert">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          {userId && (
            <ExpirationSelector
              value={expirationType}
              onChange={(val) => setValue('expirationType', val)}
              customValue={customValue}
              onChangeCustomValue={(val) => setValue('customValue', val)}
              customUnit={customUnit}
              onChangeCustomUnit={(val) => setValue('customUnit', val)}
              error={errors.customValue?.message}
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
                  href={submittedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-body"
                >
                  {submittedUrl}
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
