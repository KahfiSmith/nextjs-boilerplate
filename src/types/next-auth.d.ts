import "next-auth";
import "next-auth/jwt";

import type { DefaultSession } from "next-auth";
import type { AuthUserRole } from "@/types/auth.types";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AuthUserRole;
    };
  }

  interface User {
    role: AuthUserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AuthUserRole;
  }
}
