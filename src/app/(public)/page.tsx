"use client";

import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth-store";
import { Footer, Header } from "@/components/common";
import { Button } from "@/components/ui";

export default function HomePage() {
  const { status, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-16">
        <section className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
            Boilerplate foundation for auth, providers, hooks, API helpers, and
            route groups.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            The repo now uses non-persisted memory Zustand store and backend HttpOnly refresh cookie.
          </p>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={status === "authenticated" ? ROUTES.PROFILE : ROUTES.LOGIN}>
              {status === "authenticated" ? "Open profile" : "Sign in"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.REGISTER}>View register flow</Link>
          </Button>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Current session</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {status === "authenticated" && user
              ? `Signed in as ${user.name} (${user.email}).`
              : status === "checking"
                ? "Checking session status..."
                : "No active session in memory."}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
