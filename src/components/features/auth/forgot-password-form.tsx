"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROUTES } from "@/config/routes";
import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { Button, Input, Label } from "@/components/ui";
import { useForgotPassword } from "@/hooks/auth";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isPending, forgotPassword } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
      toast.success("If an account exists with that email, a reset link has been sent.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process request";
      toast.error(msg);
    }
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a password reset link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            Check your inbox! We sent password reset instructions if your email is registered.
          </div>
          <Button asChild className="w-full" variant="outline">
            <Link href={ROUTES.LOGIN}>Back to sign in</Link>
          </Button>
        </div>
      ) : (
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
            {errors.email?.message ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Sending link..." : "Send reset link"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href={ROUTES.LOGIN}>
              Sign in
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
