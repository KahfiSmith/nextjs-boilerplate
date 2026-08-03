export interface ApiResponse<T = unknown> {
  code?: string;
  data: T;
  error?: unknown;
  message: string;
  success: boolean;
}

export interface User {
  email: string;
  id: string;
  name: string;
  role?: string;
}

export interface BackendAuthPayload {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface AuthSession {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
  redirectTo?: string;
}

export interface AuthActionResult {
  message: string;
  ok: boolean;
  session?: AuthSession;
}

export const mapAuthPayload = (payload: BackendAuthPayload): AuthSession => ({
  accessToken: payload.access_token,
  expiresIn: payload.expires_in,
  user: payload.user,
});
