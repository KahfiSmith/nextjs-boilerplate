"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui";
import { loginCredentialsSchema } from "@/lib/schemas";

interface LoginFormProps {
  authStrategy: "nextauth" | "external" | "none";
}

type LoginFormValues = z.input<typeof loginCredentialsSchema>;

export function LoginForm({ authStrategy }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginCredentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (authStrategy !== "nextauth") {
      setError(
        "root",
        {
          message:
            authStrategy === "external"
              ? "Login is handled directly by external backend in this mode."
              : "Authentication is disabled in this mode.",
        },
      );
      return;
    }

    clearErrors("root");

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("root", {
        message: "Invalid email or password.",
      });
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  });

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
          {...register("email")}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="your-password"
          autoComplete="current-password"
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || authStrategy !== "nextauth"}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
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
