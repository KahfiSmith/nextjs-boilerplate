import { RegisterForm } from "@/components/features/auth/register-form";
import { env } from "@/config";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <RegisterForm authStrategy={env.authStrategy} />
    </main>
  );
}
