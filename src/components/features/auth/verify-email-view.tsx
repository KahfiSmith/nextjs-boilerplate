"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui";
import { useVerifyEmail, useResendVerification } from "@/hooks/auth";
import { useAuthStore } from "@/store";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const user = useAuthStore((s) => s.user);

  const defaultStatus = !token
    ? "No verification token found. You can request a new verification email below."
    : "";
  const [statusText, setStatusText] = useState<string>(defaultStatus);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resendSent, setResendSent] = useState<boolean>(false);

  const { isPending: isVerifying, verifyEmail } = useVerifyEmail();
  const { isPending: isResending, resendVerification } = useResendVerification();

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    verifyEmail({ token })
      .then(() => {
        if (isMounted) {
          setIsSuccess(true);
          setStatusText("Your email has been verified successfully!");
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Verification link expired or invalid.";
          setStatusText(msg);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail]);

  const handleResend = async () => {
    const emailToUse = user?.email;
    if (!emailToUse) {
      setStatusText("Please sign in first to resend verification email.");
      return;
    }
    try {
      await resendVerification({ email: emailToUse });
      setResendSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend verification";
      setStatusText(msg);
    }
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Email verification</h1>
        <p className="text-sm text-muted-foreground">{statusText}</p>
      </div>

      {isSuccess ? (
        <Button asChild className="w-full">
          <Link href={ROUTES.PROFILE}>Go to your profile</Link>
        </Button>
      ) : (
        <div className="space-y-3">
          {user?.email && !resendSent && (
            <Button
              className="w-full"
              disabled={isResending || isVerifying}
              onClick={handleResend}
              variant="outline"
            >
              {isResending ? "Resending..." : "Resend verification email"}
            </Button>
          )}

          {resendSent && (
            <p className="text-sm text-muted-foreground">
              A new verification email has been sent to {user?.email}.
            </p>
          )}

          <Button asChild className="w-full" variant="ghost">
            <Link href={ROUTES.LOGIN}>Back to sign in</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
