import type { AxiosError } from 'axios'
import type { ApiError } from '../types'

/**
 * Utilitário para extrair a mensagem de erro mais relevante de uma resposta da API.
 * Suporta erros HTTP comuns (401, 409), erros do FluentValidation (errors array) e erros de domínio.
 */
export function extractApiError(
  err: AxiosError<ApiError>,
  defaultMessage = 'Algo deu errado. Tente novamente.'
): string {
  const status = err.response?.status
  const errorData = err.response?.data

  const statusMessages: Record<number, string> = {
    401: 'Email ou senha incorretos.',
    409: 'Este email já está em uso.',
  }

  if (status && statusMessages[status]) {
    return statusMessages[status]
  }

  if (errorData?.errors && errorData.errors.length > 0) {
    return errorData.errors[0].description
  }
 
  if (errorData?.description) {
    return errorData.description
  }

  
  return defaultMessage
}
