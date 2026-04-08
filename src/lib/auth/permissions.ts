import type { AuthRole, AuthSession } from "@/types";

type Permission = "profile:read";

const ROLE_PERMISSIONS: Record<AuthRole, Permission[]> = {
  admin: ["profile:read"],
  guest: [],
  member: ["profile:read"],
};

export const isAuthenticated = (
  session: AuthSession | null | undefined
): session is AuthSession => Boolean(session?.user.email);

export const hasPermission = (
  session: AuthSession | null | undefined,
  permission: Permission
) => {
  if (!session) {
    return false;
  }

  return ROLE_PERMISSIONS[session.user.role].includes(permission);
};
