"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROUTES } from "@/config/routes";
import { LoginInput, loginSchema } from "@/lib/schemas/auth.schema";
import { googleAuthUrl } from "@/lib/api/client";
import { Button, Input, Label } from "@/components/ui";
import { useLogin } from "@/hooks/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { isPending, login } = useLogin();

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
      redirectTo: searchParams.get("redirectTo") || ROUTES.PROFILE,
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
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
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

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Continue"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button asChild className="w-full" variant="outline">
        <a href={googleAuthUrl()}>Continue with Google</a>
      </Button>

      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="underline" href={ROUTES.REGISTER}>
          Open registration guide
        </Link>
      </p>
    </section>
  );
}
