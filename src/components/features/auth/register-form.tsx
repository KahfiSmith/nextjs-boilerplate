"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { routes } from "@/config";
import { getAuthStrategyMeta } from "@/lib/auth";
import { RegisterInput, registerSchema } from "@/lib/schemas/auth.schema";
import type { AuthStrategy } from "@/types";

export function RegisterForm({
  authStrategy,
}: Readonly<{
  authStrategy: AuthStrategy;
}>) {
  const authMeta = getAuthStrategyMeta(authStrategy);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    toast.info("Registration submitted (UI Mock)", {
      description: `Name: ${data.name}, Email: ${data.email}`
    });
    // eslint-disable-next-line no-console
    console.log("Registration logic not yet implemented", data);
  };

  return (
    <section className="w-full max-w-lg space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{authMeta.label}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registration setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep the UI route in place, then replace the bootstrap flow with your
          backend registration contract when it is ready.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="John Doe"
            type="text"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            autoComplete="email"
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password")}
            autoComplete="new-password"
            placeholder="••••••••"
            type="password"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>

      <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
        Configure `AUTH_MODE=external` and `BACKEND_API_URL` when the real auth
        backend is available.
      </div>

      <Button asChild variant="outline">
        <Link href={routes.login}>Go to login</Link>
      </Button>
    </section>
  );
}
