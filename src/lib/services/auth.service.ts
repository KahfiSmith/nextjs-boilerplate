import {
  findDemoUserByCredentials,
  findExternalUserByCredentials,
} from "@/lib/repositories/auth.repository";
import { env } from "@/config/env";
import { loginCredentialsSchema } from "@/lib/schemas";
import type { AuthUser, LoginCredentials } from "@/types/auth.types";

function validateCredentials(credentials: LoginCredentials): LoginCredentials | null {
  const result = loginCredentialsSchema.safeParse(credentials);

  if (!result.success) {
    return null;
  }

  return result.data;
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
