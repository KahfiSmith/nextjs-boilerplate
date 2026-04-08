import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env, routes } from "@/config";
import {
  AUTH_SESSION_COOKIE,
  parseAuthSessionCookie,
} from "@/lib/auth";

const isProtectedRoute = (pathname: string) =>
  pathname === routes.profile || pathname.startsWith(`${routes.profile}/`);

export default function middleware(request: NextRequest) {
  if (env.authStrategy === "none") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const session = parseAuthSessionCookie(sessionCookie);

  if (pathname === routes.login && session) {
    return NextResponse.redirect(new URL(routes.profile, request.url));
  }

  if (isProtectedRoute(pathname) && !session) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set(
      "redirectTo",
      `${pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/profile/:path*"],
};
