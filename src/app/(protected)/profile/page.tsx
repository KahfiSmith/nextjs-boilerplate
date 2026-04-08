import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui";
import { routes } from "@/config";
import { hasPermission, isAuthenticated, getAuthSession } from "@/lib/auth";
import { LogoutButton } from "@/components/features/auth/logout-button";

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!isAuthenticated(session)) {
    redirect(routes.login);
  }

  if (!hasPermission(session, "profile:read")) {
    redirect(routes.home);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-xl space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-primary">Protected route</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {session.user.name}
          </h1>
        </div>

        <dl className="grid gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
          <div>
            <dt className="font-medium">Email</dt>
            <dd className="text-muted-foreground">{session.user.email}</dd>
          </div>
          <div>
            <dt className="font-medium">Role</dt>
            <dd className="text-muted-foreground">{session.user.role}</dd>
          </div>
          <div>
            <dt className="font-medium">Expires</dt>
            <dd className="text-muted-foreground">{session.expiresAt}</dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={routes.home}>Back home</Link>
          </Button>
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
