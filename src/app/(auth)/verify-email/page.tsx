"use client";

import { Suspense } from "react";
import { VerifyEmailView } from "@/components/features/auth/verify-email-view";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
      <VerifyEmailView />
    </Suspense>
  );
}
