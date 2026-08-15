"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "@/components/features/auth/login-form";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(ROUTES.PROFILE);
    }
  }, [status, router]);

  if (status === "checking" || status === "idle") {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return <LoginForm />;
}
