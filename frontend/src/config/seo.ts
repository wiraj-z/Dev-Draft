import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetaInput = {
  title?: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "",
}: PageMetaInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...siteConfig.keywords],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}
