"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { routes } from "@/config";
import { useLogin } from "@/hooks";
import { getAuthStrategyMeta } from "@/lib/auth";
import { LoginInput, loginSchema } from "@/lib/schemas/auth.schema";
import type { AuthStrategy } from "@/types";

export function LoginForm({
  authStrategy,
}: Readonly<{
  authStrategy: AuthStrategy;
}>) {
  const searchParams = useSearchParams();
  const { error, isPending, login, message } = useLogin(authStrategy);
  const authMeta = getAuthStrategyMeta(authStrategy);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    const promise = login({
      email: data.email,
      password: data.password,
      redirectTo: searchParams.get("redirectTo") || routes.profile,
    });

    toast.promise(promise, {
      loading: "Signing you in...",
      success: "Successfully signed in!",
      error: (err) => err?.message || "Failed to sign in. Please check your credentials.",
    });
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{authMeta.label}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">{authMeta.description}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            autoComplete="email"
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password")}
            autoComplete="current-password"
            placeholder="••••••••"
            type="password"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        )}

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
