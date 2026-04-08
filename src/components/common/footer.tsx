import { siteConfig } from "@/config";

export function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto w-full max-w-5xl px-6 py-4 text-sm text-muted-foreground">
        {siteConfig.description}
      </div>
    </footer>
  );
}
