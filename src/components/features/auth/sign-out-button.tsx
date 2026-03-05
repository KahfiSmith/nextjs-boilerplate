"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      type="button"
    >
      Sign out
    </Button>
  );
}
