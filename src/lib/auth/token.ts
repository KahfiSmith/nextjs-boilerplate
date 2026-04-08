import type { AuthSession } from "@/types";

export const AUTH_SESSION_COOKIE = "app.auth.session";

const decodeCookieValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const encodeCookieValue = (value: string) => encodeURIComponent(value);

export const parseAuthSessionCookie = (
  value: string | undefined
): AuthSession | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeCookieValue(value)) as AuthSession;

    if (!parsed?.user?.email || !parsed?.expiresAt) {
      return null;
    }

    if (Date.parse(parsed.expiresAt) <= Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const serializeAuthSessionCookie = (session: AuthSession) => {
  const maxAgeSeconds = Math.max(
    0,
    Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000)
  );

  return `${AUTH_SESSION_COOKIE}=${encodeCookieValue(
    JSON.stringify(session)
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
};
