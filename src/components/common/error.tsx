"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-xl space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              We could not render this page right now.
            </p>
          </div>
        </div>

        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p>Error: {error.message || "Unexpected error"}</p>
          {error.digest ? <p>Digest: {error.digest}</p> : null}
        </div>

        <div className="flex gap-3">
          <Button type="button" onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button type="button" variant="outline" onClick={() => location.assign("/")}>
            Go home
          </Button>
        </div>
      </section>
    </main>
  );
}
