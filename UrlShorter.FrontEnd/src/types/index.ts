
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
}

export type ShortenUrlResponse = string
export interface UrlItem {
  shortCode: string
  originalUrl: string
  createdAt: string
}
export interface ApiError {
  message?: string
  errors?: Record<string, string[]>
}
