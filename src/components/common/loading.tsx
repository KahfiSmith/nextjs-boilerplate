import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <Loader2 className="h-5 w-5 animate-spin" />
    </main>
  );
}