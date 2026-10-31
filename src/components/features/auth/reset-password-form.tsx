"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROUTES } from "@/config/routes";
import { ResetPasswordInput, resetPasswordSchema } from "@/lib/schemas/auth.schema";
import { Button, Input, Label } from "@/components/ui";
import { useResetPassword } from "@/hooks/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { isPending, resetPassword } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      reset_token: token,
      new_password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword(data);
      toast.success("Password reset successfully! Please log in.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(msg);
    }
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("reset_token")} value={token} />

        {!token && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            Missing reset token. Please open the link from your email or request a new one.
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="new_password">New Password</Label>
          <Input
            id="new_password"
            {...register("new_password")}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            type="password"
          />
          {errors.new_password?.message ? (
            <p className="text-sm text-destructive">{errors.new_password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" disabled={isPending || !token} type="submit">
          {isPending ? "Updating password..." : "Reset password"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <Link className="text-primary underline-offset-4 hover:underline" href={ROUTES.LOGIN}>
            Back to sign in
          </Link>
        </div>
      </form>
    </section>
  );
}
