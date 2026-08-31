export const siteConfig = {
  name: "Inkwell",
  description:
    "A modern blog platform for sharing ideas, stories, and technical writing.",
  author: {
    name: "Blog Author",
    bio: "Writer, developer, and lifelong learner sharing thoughts on technology and creativity.",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  keywords: ["blog", "writing", "technology", "fastapi", "nextjs"],
} as const;
