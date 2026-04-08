"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { routes } from "@/config";
import { getAuthStrategyMeta } from "@/lib/auth";
import { useLogin } from "@/hooks";
import type { AuthStrategy } from "@/types";

export function LoginForm({
  authStrategy,
}: Readonly<{
  authStrategy: AuthStrategy;
}>) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isPending, login, message } = useLogin(authStrategy);
  const authMeta = getAuthStrategyMeta(authStrategy);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await login({
      email,
      password,
      redirectTo: searchParams.get("redirectTo") || routes.profile,
    });
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{authMeta.label}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">{authMeta.description}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input
            autoComplete="email"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Password</span>
          <input
            autoComplete="current-password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            value={password}
          />
        </label>

        {error ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Creating session..." : "Continue"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="underline" href={routes.register}>
          Open registration guide
        </Link>
      </p>
    </section>
  );
}
