import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex gap-1.5 items-center", className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 200, 400].map((delay) => (
        <div
          key={delay}
          className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
