
export interface User {
  id: string
  name: string
  email: string
}



export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  name: string
  token: {
    token: string
    expiresAt: string
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
}
export interface ShortenUrlRequest {
  originalUrl: string
  userId?: string
  expiresAt?: string
  name?: string
}

export type ShortenUrlResponse = string
export interface UrlItem {
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  expiresAt?: string
  name?: string
}
export interface DomainError {
  code: string
  description: string
  type?: number
}

export interface ApiError {
  title?: string
  status?: number
  errors?: DomainError[]
  code?: string
  description?: string
}

