import Link from "next/link";

import { env } from "@/config/env";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-lg space-y-4 rounded-lg border p-6">
        <h1 className="text-xl font-semibold">
          Registration is handled by your backend
        </h1>
        <p className="text-sm text-muted-foreground">
          This frontend sends credentials to your external API (Go/Express/Nest)
          through service and repository layers.
        </p>
        <p className="text-sm text-muted-foreground">
          Active strategy: <strong>{env.authStrategy}</strong>
        </p>
        <div className="rounded-md bg-muted p-4 text-sm">
          <p>Configure `.env.local`:</p>
          <p>`AUTH_MODE=external` and `BACKEND_API_URL`</p>
        </div>
        <Link href="/auth/login" className="text-sm underline">
          Go to login
        </Link>
      </section>
    </main>
  );
}
