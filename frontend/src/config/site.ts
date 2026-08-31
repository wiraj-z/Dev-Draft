export const siteConfig = {
  name: "DevDraft",
  description:
    "A modern blog platform for sharing ideas, stories, and technical writing.",
  author: {
    name: "Sayuranga Wiraj",
    bio: "Full stack Engineer with a passion for building scalable and maintainable systems.",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  keywords: ["blog", "writing", "technology", "fastapi", "nextjs"],
} as const;
