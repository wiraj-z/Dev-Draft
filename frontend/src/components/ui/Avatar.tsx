import Image from "next/image";
import { resolveImageUrl } from "@/lib/utils/images";
import { cn } from "@/lib/utils/cn";

type AvatarProps = {
  imagePath: string;
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export function Avatar({
  imagePath,
  username,
  size = "md",
  className,
}: AvatarProps) {
  const src = resolveImageUrl(imagePath);

  return (
    <Image
      src={src}
      alt={`${username}'s profile`}
      width={64}
      height={64}
      className={cn(
        "rounded-full object-cover ring-2 ring-white",
        sizeClasses[size],
        className,
      )}
      unoptimized
    />
  );
}
