import Link from "next/link";

import { SignOutButton } from "@/components/features";
import { env } from "@/config/env";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-xl space-y-6 rounded-lg border p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Auth-ready boilerplate</h1>
          <p className="text-sm text-muted-foreground">
            App Router + NextAuth credentials flow with service and repository separation.
          </p>
          <p className="text-xs text-muted-foreground">
            Active auth strategy: {env.authStrategy}
          </p>
        </header>

        {session?.user ? (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 text-sm">
              <p>Signed in as: {session.user.email}</p>
              <p>User id: {session.user.id}</p>
              <p>Role: {session.user.role}</p>
            </div>
            <SignOutButton />
          </div>
        ) : env.authStrategy === "none" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Authentication is disabled (`AUTH_STRATEGY=none`).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are not authenticated yet.
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
              >
                Register info
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
