export interface AuthUser {
  email: string;
  id: string;
  name: string;
  role?: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
  user: AuthUser;
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
