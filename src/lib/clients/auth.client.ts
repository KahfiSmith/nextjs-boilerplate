import { env } from "@/config/env";
import type { LoginCredentials } from "@/types/auth.types";

const DEFAULT_TIMEOUT_MS = 8000;

const withLeadingSlash = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

const createUrl = (): string => {
  if (!env.backendApiUrl) {
    throw new Error("BACKEND_API_URL is not configured.");
  }

  const baseUrl = env.backendApiUrl.replace(/\/+$/, "");
  const path = withLeadingSlash(env.backendAuthLoginPath);
  return `${baseUrl}${path}`;
};

export async function postExternalAuthLogin(
  credentials: LoginCredentials
): Promise<unknown | null> {
  const controller = new AbortController();
  const timeoutMs = env.backendAuthTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(createUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
