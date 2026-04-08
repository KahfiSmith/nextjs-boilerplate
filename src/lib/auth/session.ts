import { cookies } from "next/headers";

import { AUTH_SESSION_COOKIE, parseAuthSessionCookie } from "@/lib/auth/token";

export const getAuthSession = async () => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  return parseAuthSessionCookie(cookieValue);
};

export const clearAuthSessionCookie = () =>
  `${AUTH_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
