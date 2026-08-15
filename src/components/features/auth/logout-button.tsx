"use client";

import { Button } from "@/components/ui";
import { useLogout } from "@/hooks/auth";

export function LogoutButton() {
  const { isPending, logout } = useLogout();

  return (
    <Button disabled={isPending} onClick={() => logout()} type="button">
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
