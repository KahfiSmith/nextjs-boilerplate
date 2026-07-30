import Link from "next/link";

import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { getAuthSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getAuthSession();

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
            The repo now has a simple bootstrap session flow so the structure is
            no longer empty while the real auth backend is still pending.
          </p>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={session ? ROUTES.PROFILE : ROUTES.LOGIN}>
              {session ? "Open profile" : "Sign in"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.REGISTER}>View register flow</Link>
          </Button>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Current session</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {session
              ? `Signed in as ${session.user.name} (${session.user.email}).`
              : "No active session cookie found."}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
