// Adicione isto ao final do arquivo ../UrlShorter.FrontEnd/src/types/index.ts ou verifique se já existe algo similar

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
  code: string;
  description: string;
  
  type: number;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: {
    token: string;
    expiresAt: string;
  };
  name: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
}
