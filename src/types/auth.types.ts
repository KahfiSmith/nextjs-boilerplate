export interface User {
  email: string;
  id: number;
  name: string;
  role: string;
  is_email_verified: boolean;
  created_at?: string;
  updated_at?: string;
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
