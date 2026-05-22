import { api } from './api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
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
