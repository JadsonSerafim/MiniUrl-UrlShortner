import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { extendUrlExpiration } from '../services/url.service'
import { extractApiError } from '../utils/errorParser'
import Button from './Button'
import Input from './Input'

interface ExtendExpirationModalProps {
  shortCode: string
  isOpen: boolean
  onClose: () => void
}

export default function ExtendExpirationModal({ shortCode, isOpen, onClose }: ExtendExpirationModalProps) {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState<number>(7)
  const [unit, setUnit] = useState<'days' | 'months'>('days')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => extendUrlExpiration(shortCode, quantity, unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userUrls'] })
      onClose()
    },
    onError: (err: any) => {
      setErrorMessage(extractApiError(err))
    },
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    mutation.mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-hairline bg-surface text-ink shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-primary">Estender Validade</span>
            <h3 className="text-xl font-bold mt-0.5 text-mono text-ink">{shortCode}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-soft text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-xs text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantidade"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-body">Unidade</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'days' | 'months')}
                className="input-base w-full h-11"
              >
                <option value="days">Dias</option>
                <option value="months">Meses</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            A nova data de expiração será calculada adicionando o valor acima à data de validade atual do link. O limite máximo de expiração é de 1 ano a partir de hoje.
          </p>

          <div className="flex items-center justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Estender
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
