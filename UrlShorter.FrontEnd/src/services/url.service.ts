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
export interface ClickLog {
  ipAddress: string
  userAgent?: string
  occurredAt: string
}
export interface UrlAnalytics {
  shortCode: string
  originalUrl: string
  totalClicks: number
  clicks: ClickLog[]
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
 * GET /api/urls/my-urls
 * Busca todas as URLs encurtadas do usuário autenticado.
 */
export async function getMyUrls(): Promise<UrlItem[]> {
  try {
    const { data } = await api.get<ApiShortenedUrl[]>('/urls/my-urls')
    return data.map((item) => ({
      shortCode: item.shortCode,
      originalUrl: typeof item.originalUrl === 'object' ? item.originalUrl.value : item.originalUrl,
      clickCount: item.clickCount,
      expiresAt: item.expiresAt,
      createdAt: item.createdAt,
    }))
  } catch (err: any) {
    if (err.response?.status === 404) {
      return []
    }
    throw err
  }
}
/**
 * GET /api/urls/{shortCode}/analytics?userId={userId}
 * Retorna um objeto com as estatísticas de cliques da URL encurtada.
 */
export async function getUrlAnalytics(shortCode: string, userId: string): Promise<UrlAnalytics> {
  const sanitizedPayload = {
    userId: userId && userId.trim() !== '' ? userId : undefined,
  }
  const { data } = await api.get<UrlAnalytics>(`/urls/${shortCode}/analytics`, { params: sanitizedPayload })
  return data
}