import { api } from './api'
import type { ShortenUrlRequest, UrlItem } from '../types'

export interface ApiShortenedUrl {
  id: string
  originalUrl: { value: string } | string
  shortCode: string
  clickCount: number
  expiresAt?: string
  userId?: string
  createdAt: string
  isActive: boolean
}

/**
 * POST /api/urls
 * Encurta uma URL. Se o usuário estiver autenticado, associa ao seu userId.
 * Retorna o shortCode gerado (string).
 */
export async function shortenUrl(payload: ShortenUrlRequest): Promise<string> {
  const sanitizedPayload = {
    ...payload,
    userId: payload.userId && payload.userId.trim() !== '' ? payload.userId : undefined,
  }
  const { data } = await api.post<string>('/urls', sanitizedPayload)
  return data
}

/**
 * GET /api/urls/user/{userId}
 * Busca todas as URLs encurtadas de um usuário específico.
 */
export async function getUserUrls(userId: string): Promise<UrlItem[]> {
  try {
    const { data } = await api.get<ApiShortenedUrl[]>(`/urls/user/${userId}`)
    return data.map((item) => ({
      shortCode: item.shortCode,
      originalUrl: typeof item.originalUrl === 'object' ? item.originalUrl.value : item.originalUrl,
      createdAt: new Date(item.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }))
  } catch (err: any) {
    if (err.response?.status === 404) {
      return []
    }
    throw err
  }
}
