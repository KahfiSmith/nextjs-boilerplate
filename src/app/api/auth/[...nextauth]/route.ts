import { NextResponse } from "next/server";

import { env } from "@/config/env";

const nextAuthDisabledResponse = () =>
  NextResponse.json({ error: "NextAuth is disabled." }, { status: 404 });

export async function GET(request: Request) {
  if (env.authStrategy !== "nextauth") {
    return nextAuthDisabledResponse();
  }

  const [{ default: NextAuth }, { authOptions }] = await Promise.all([
    import("next-auth"),
    import("@/lib/auth/config"),
  ]);

  const handler = NextAuth(authOptions);
  return handler(request);
}

export async function POST(request: Request) {
  if (env.authStrategy !== "nextauth") {
    return nextAuthDisabledResponse();
  }

  const [{ default: NextAuth }, { authOptions }] = await Promise.all([
    import("next-auth"),
    import("@/lib/auth/config"),
  ]);

  const handler = NextAuth(authOptions);
  return handler(request);
}
