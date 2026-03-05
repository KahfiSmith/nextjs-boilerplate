import { env } from "@/config/env";
import { postExternalAuthLogin } from "@/lib/clients/auth.client";
import type {
  AuthUser,
  ExternalAuthUserPayload,
  LoginCredentials,
} from "@/types/auth.types";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export async function findDemoUserByCredentials(
  credentials: LoginCredentials
): Promise<AuthUser | null> {
  const email = normalizeEmail(credentials.email);
  const configuredEmail = normalizeEmail(env.demoAuthEmail);

  if (email !== configuredEmail) {
    return null;
  }

  if (credentials.password !== env.demoAuthPassword) {
    return null;
  }

  return {
    id: "demo-user",
    name: env.demoAuthName,
    email: env.demoAuthEmail,
    role: "user",
  };
}

const readRole = (role: string | undefined): AuthUser["role"] =>
  role === "admin" ? "admin" : "user";

const mapExternalUserPayload = (input: unknown): AuthUser | null => {
  if (!input || typeof input !== "object") {
    return null;
  }

  const payload = input as Record<string, unknown>;
  const candidate =
    (payload.user as ExternalAuthUserPayload | undefined) ??
    (payload.data as { user?: ExternalAuthUserPayload } | undefined)?.user ??
    (payload as ExternalAuthUserPayload);

  const id = candidate?.id ?? candidate?.userId;
  const email = candidate?.email;

  if (!id || !email) {
    return null;
  }

  return {
    id: String(id),
    email,
    name: candidate.name ?? candidate.fullName ?? email.split("@")[0],
    role: readRole(candidate.role),
  };
};

export async function findExternalUserByCredentials(
  credentials: LoginCredentials
): Promise<AuthUser | null> {
  if (!env.backendApiUrl) {
    return null;
  }

  const response = await postExternalAuthLogin(credentials);
  return mapExternalUserPayload(response);
}
