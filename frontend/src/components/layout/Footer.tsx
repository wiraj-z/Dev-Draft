import Link from "next/link";
import { footerNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-brand-500">◈</span>
            {siteConfig.name}
          </h2>
          <p className="mt-2 text-sm text-muted max-w-xs leading-relaxed">{siteConfig.description}</p>
        </div>

        <div className="md:justify-self-end text-left md:text-right">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Navigation
          </h3>
          <ul className="mt-3 flex flex-wrap gap-4 md:justify-end">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
