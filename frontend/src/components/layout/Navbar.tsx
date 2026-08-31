"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authNavItems, mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const visibleMainNav = mainNavItems.filter((item) => {
    if (item.requiresAuth) {
      return isAuthenticated;
    }
    return true;
  });

  const visibleAuthNav = authNavItems.filter((item) => {
    if (item.guestOnly) {
      return !isAuthenticated && !isLoading;
    }
    return true;
  });

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-border bg-surface/80 px-6 backdrop-blur-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground transition-opacity hover:opacity-80">
          <span className="text-brand-500">◈</span>
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {visibleMainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-foreground"
                    : "text-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/post-create/create" aria-label="Create Post" title="Create Post" className="text-muted hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                  </svg>
                </Link>
                <Link href="/account" aria-label="Profile" title="Profile" className="text-muted hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {visibleAuthNav.map((item) => {
                  if (item.href === "/register") {
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button size="sm" variant="primary">
                          {item.label}
                        </Button>
                      </Link>
                    );
                  }
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
