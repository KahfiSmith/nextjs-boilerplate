import { redirect } from "next/navigation";

import { LoginForm } from "@/components/features/auth/login-form";
import { env } from "@/config/env";
import { getAuthSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <LoginForm authStrategy={env.authStrategy} />
    </main>
  );
}
