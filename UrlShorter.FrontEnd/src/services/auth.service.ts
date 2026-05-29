import { api } from './api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types'

/**
 * POST /api/users/login
 * Autentica um usuário existente e retorna o JWT.
 */
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/users/login', payload)
  return data
}

/**
 * POST /api/users
 * Cadastra um novo usuário no sistema.
 */
export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/users', payload)
  return data
}

/**
 * POST /api/users/forgot-password
 * Inicia o fluxo de recuperação de senha enviando código por email.
 */
export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await api.post('/users/forgot-password', payload)
}

/**
 * POST /api/users/reset-password
 * Redefine a senha usando o código recebido por email.
 */
export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await api.post('/users/reset-password', payload)
}