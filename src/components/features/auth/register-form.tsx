"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { useRegister } from "@/hooks/auth";
import { RegisterInput, registerSchema } from "@/lib/schemas/auth.schema";

export function RegisterForm() {
  const { isPending, register: registerAuth } = useRegister();

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
    const promise = registerAuth(data);

    toast.promise(promise, {
      error: (err) => err?.message || "Failed to create account.",
      loading: "Creating account...",
      success: "Account created! Redirecting to login...",
    });
  };

  return (
    <section className="w-full max-w-lg space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Registration setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Create an account to continue.
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

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Button asChild variant="outline">
        <Link href={ROUTES.LOGIN}>Go to login</Link>
      </Button>
    </section>
  );
}
