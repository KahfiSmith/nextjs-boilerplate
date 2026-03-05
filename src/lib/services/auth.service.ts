import {
  findDemoUserByCredentials,
  findExternalUserByCredentials,
} from "@/lib/repositories/auth.repository";
import { env } from "@/config/env";
import type { AuthUser, LoginCredentials } from "@/types/auth.types";

const sanitize = (value: string): string => value.trim();

function validateCredentials(credentials: LoginCredentials): LoginCredentials | null {
  const email = sanitize(credentials.email);
  const password = sanitize(credentials.password);

  if (!email || !password) {
    return null;
  }

  return {
    email,
    password,
  };
}

export async function authenticateWithCredentials(
  input: LoginCredentials
): Promise<AuthUser | null> {
  if (env.authStrategy !== "nextauth") {
    return null;
  }

  const credentials = validateCredentials(input);

  if (!credentials) {
    return null;
  }

  if (env.authMode === "demo") {
    return findDemoUserByCredentials(credentials);
  }

  return findExternalUserByCredentials(credentials);
}
