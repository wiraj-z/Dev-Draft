import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-7 h-7 bg-brand-500", className)}
      style={{ animation: "morph 2s ease-in-out infinite" }}
      role="status"
      aria-label="Loading"
    />
  );
}
