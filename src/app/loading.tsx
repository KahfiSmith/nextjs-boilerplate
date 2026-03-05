import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-xl space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Loading content</h1>
            <p className="text-sm text-muted-foreground">
              Preparing page data and UI.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      </section>
    </main>
  );
}
