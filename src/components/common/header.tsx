import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="border-b bg-background/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link className="font-semibold tracking-tight" href={ROUTES.HOME}>
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={ROUTES.HOME}>Home</Link>
          <Link href={ROUTES.LOGIN}>Login</Link>
          <Link href={ROUTES.REGISTER}>Register</Link>
        </nav>
      </div>
    </header>
  );
}
