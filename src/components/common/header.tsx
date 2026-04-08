import Link from "next/link";

import { publicNavigation, siteConfig } from "@/config";

export function Header() {
  return (
    <header className="border-b bg-background/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link className="font-semibold tracking-tight" href="/">
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
