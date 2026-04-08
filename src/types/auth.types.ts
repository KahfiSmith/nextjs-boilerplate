export type AuthStrategy = "nextauth" | "external" | "none";
export type AuthRole = "guest" | "member" | "admin";

export interface AuthUser {
  email: string;
  name: string;
  role: AuthRole;
}

export interface AuthSession {
  expiresAt: string;
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
