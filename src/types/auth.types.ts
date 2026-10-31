import type { components } from "@/lib/api/generated/schema";

export type UserRole = "user" | "admin" | (string & {});

export type User = components["schemas"]["User"];

export type BackendAuthPayload = components["schemas"]["AuthData"];

export type SessionItem = components["schemas"]["SessionItem"];

export interface AuthSession {
  accessToken: string;
  expiresIn: number;
  user: User;
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
