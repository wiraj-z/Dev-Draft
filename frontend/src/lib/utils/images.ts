import { env } from "@/config/env";

export function resolveImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${env.apiUrl}${imagePath}`;
  }

  return `${env.apiUrl}/${imagePath}`;
}
