"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui";

interface LoginFormProps {
  authStrategy: "nextauth" | "external" | "none";
}

export function LoginForm({ authStrategy }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authStrategy !== "nextauth") {
      setError(
        authStrategy === "external"
          ? "Login is handled directly by external backend in this mode."
          : "Authentication is disabled in this mode."
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setIsLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use your credentials to continue.
        </p>
        {authStrategy !== "nextauth" ? (
          <p className="text-sm text-muted-foreground">
            Active strategy: <strong>{authStrategy}</strong>
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="your-password"
          required
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || authStrategy !== "nextauth"}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/auth/register" className="text-foreground underline">
          View register info
        </Link>
      </p>
    </form>
  );
}
