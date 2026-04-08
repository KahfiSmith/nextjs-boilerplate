"use client";

import { Button } from "@/components/ui";
import { useLogin } from "@/hooks";

export function LogoutButton() {
  const { isPending, logout } = useLogin("external");

  return (
    <Button disabled={isPending} onClick={logout} type="button">
      {isPending ? "Leaving..." : "Sign out"}
    </Button>
  );
}
