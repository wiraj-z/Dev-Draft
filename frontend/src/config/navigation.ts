export type NavItem = {
  label: string;
  href: string;
  requiresAuth?: boolean;
  guestOnly?: boolean;
};

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export const authNavItems: NavItem[] = [
  { label: "Log in", href: "/login", guestOnly: true },
  { label: "Sign up", href: "/register", guestOnly: true },
];

export const footerNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Account", href: "/account" },
];

export const socialLinks = {
  github: "",
  twitter: "",
  linkedin: "",
} as const;
