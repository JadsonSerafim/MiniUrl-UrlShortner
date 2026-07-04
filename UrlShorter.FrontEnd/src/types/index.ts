export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiError {
  code?: string;
  description?: string;
  type?: number;
  title?: string;
  status?: number;
  errors?: Record<string, string[]> | Array<{ code?: string; description?: string; type?: number; status?: number }>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: {
    token: string;
    expiresAt: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
}

export interface UrlItem {
  name?: string
  shortCode: string
  originalUrl: string
  clickCount: number
  expiresAt?: string
  createdAt: string
}

export interface ShortenUrlRequest {
  originalUrl: string
  userId?: string
  expiresAt?: string
  name?: string
}
