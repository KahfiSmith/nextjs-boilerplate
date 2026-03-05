export type AuthUserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthUserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ExternalAuthUserPayload {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name?: string;
  fullName?: string;
  role?: string;
}
