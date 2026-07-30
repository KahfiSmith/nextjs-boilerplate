import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROUTES } from "@/config/routes";
import { USER_SESSION_COOKIE } from "@/lib/auth/session";

const isProtectedRoute = (pathname: string) =>
  pathname === ROUTES.PROFILE || pathname.startsWith(`${ROUTES.PROFILE}/`);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(USER_SESSION_COOKIE)?.value;

  if (pathname === ROUTES.LOGIN && sessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.PROFILE, request.url));
  }

  if (isProtectedRoute(pathname) && !sessionCookie) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
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
