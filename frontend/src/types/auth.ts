export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export type AuthUser = Omit<AuthResponse, "token">;

export interface SessionResponse {
  user: AuthUser | null;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string> | null;
}
