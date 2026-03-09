import { env } from "@/config/env";
import { fetchJson } from "@/lib/api/fetcher";
import {
  externalAuthResponseSchema,
  type ExternalAuthResponse,
} from "@/lib/schemas";
import type { LoginCredentials } from "@/types/auth.types";

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
): Promise<ExternalAuthResponse | null> {
  try {
    return await fetchJson(createUrl(), {
      method: "POST",
      jsonBody: credentials,
      schema: externalAuthResponseSchema,
      timeoutMs: env.backendAuthTimeoutMs,
      cache: "no-store",
    });
  } catch {
    return null;
  }
}
