import { cookies } from "next/headers";

import type { AuthSession } from "@/types/auth.types";

export const USER_SESSION_COOKIE = "app.user.session";

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(USER_SESSION_COOKIE)?.value;

  if (!rawCookie) return null;

  try {
    const session = JSON.parse(decodeURIComponent(rawCookie)) as AuthSession;
    if (Date.parse(session.expiresAt) <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
};

export const setAuthSessionCookie = (session: AuthSession) => {
  const maxAgeSeconds = Math.max(
    0,
    Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000)
  );

  return `${USER_SESSION_COOKIE}=${encodeURIComponent(
    JSON.stringify(session)
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
};

export const clearAuthSessionCookie = () =>
  `${USER_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
