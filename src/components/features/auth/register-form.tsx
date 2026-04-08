import Link from "next/link";

import { Button } from "@/components/ui";
import { routes } from "@/config";
import { getAuthStrategyMeta } from "@/lib/auth";
import type { AuthStrategy } from "@/types";

export function RegisterForm({
  authStrategy,
}: Readonly<{
  authStrategy: AuthStrategy;
}>) {
  const authMeta = getAuthStrategyMeta(authStrategy);

  return (
    <section className="w-full max-w-lg space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{authMeta.label}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registration setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep the UI route in place, then replace the bootstrap flow with your
          backend registration contract when it is ready.
        </p>
      </div>

      <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
        Configure `AUTH_MODE=external` and `BACKEND_API_URL` when the real auth
        backend is available.
      </div>

      <Button asChild variant="outline">
        <Link href={routes.login}>Go to login</Link>
      </Button>
    </section>
  );
}
