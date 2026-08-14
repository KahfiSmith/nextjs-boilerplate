"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { useDeleteAccount } from "@/hooks/auth/use-delete-account";
import {
  DeleteAccountInput,
  deleteAccountSchema,
} from "@/lib/schemas/auth.schema";

export function DeleteAccountButton() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { isPending, deleteAccount } = useDeleteAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: DeleteAccountInput) => {
    const promise = deleteAccount({ password: data.password });

    toast.promise(promise, {
      loading: "Deleting account...",
      success: "Account deleted. Redirecting to login...",
      error: (err) =>
        err?.message || "Failed to delete account. Please check your password.",
    });

    try {
      await promise;
    } finally {
      reset();
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {confirmOpen ? (
        <form
          className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-sm text-muted-foreground">
            This permanently deletes your account. Enter your password to
            confirm.
          </p>
          <div className="space-y-2">
            <Label htmlFor="delete-password">Password</Label>
            <Input
              id="delete-password"
              {...register("password")}
              autoComplete="current-password"
              placeholder="••••••••"
              type="password"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={isPending}
              type="button"
              variant="destructive"
              onClick={() => {
                reset();
                setConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit" variant="destructive">
              {isPending ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
        >
          Delete account
        </Button>
      )}
    </div>
  );
}
