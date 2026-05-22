import { api } from './api'
import type { ShortenUrlRequest } from '../types'

/**
 * POST /api/urls
 * Encurta uma URL. Se o usuário estiver autenticado, associa ao seu userId.
 * Retorna o shortCode gerado (string).
 */
export async function shortenUrl(payload: ShortenUrlRequest): Promise<string> {
  const { data } = await api.post<string>('/urls', payload)
  return data
}
