import { z } from 'zod'

export const shortenUrlSchema = z.object({
  originalUrl: z.string()
    .min(1, 'A URL é obrigatória.')
    .transform((val) => {
      const trimmed = val.trim()
      if (trimmed && !/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`
      }
      return trimmed
    })
    .pipe(z.string().url({ message: 'Por favor, insira uma URL válida (ex: https://exemplo.com).' })),
  expirationType: z.enum(['1d', '7d', '30d', '365d', 'custom']),
  customValue: z.union([z.number(), z.literal('')]),
  customUnit: z.enum(['hours', 'days']),
}).refine(
  (data) => {
    if (data.expirationType === 'custom' && data.customValue === '') {
      return false
    }
    return true
  },
  {
    message: 'O tempo de validade personalizado é obrigatório.',
    path: ['customValue'],
  }
)

export type ShortenUrlFormValues = z.infer<typeof shortenUrlSchema>

export const getExpiresAtDate = (data: ShortenUrlFormValues, userId?: string): string | undefined => {
  if (!userId) return undefined

  const now = new Date()
  switch (data.expirationType) {
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
      const val = data.customValue === '' ? 1 : data.customValue
      if (data.customUnit === 'days') {
        now.setDate(now.getDate() + val)
      } else {
        now.setHours(now.getHours() + val)
      }
      return now.toISOString()
    default:
      return undefined
  }
}
