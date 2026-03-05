import nextAuthMiddleware from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/config/env";

export default function middleware(request: NextRequest) {
  if (env.authStrategy !== "nextauth") {
    return NextResponse.next();
  }

  const authMiddleware = nextAuthMiddleware as unknown as (
    req: NextRequest
  ) => ReturnType<typeof NextResponse.next>;

  return authMiddleware(request);
}

export const config = { matcher: ["/"] };
