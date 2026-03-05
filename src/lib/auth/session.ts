import { env } from "@/config/env";

export async function getAuthSession() {
  if (env.authStrategy !== "nextauth") {
    return null;
  }

  const [{ getServerSession }, { authOptions }] = await Promise.all([
    import("next-auth"),
    import("@/lib/auth/config"),
  ]);

  return getServerSession(authOptions);
}
