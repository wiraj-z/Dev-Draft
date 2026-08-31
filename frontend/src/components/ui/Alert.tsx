import { cn } from "@/lib/utils/cn";

type AlertProps = {
  variant?: "info" | "success" | "error";
  children: React.ReactNode;
  className?: string;
};

const variantClasses = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  success: "border-green-500/20 bg-green-500/10 text-green-400",
  error: "border-red-500/20 bg-red-500/10 text-red-400",
};

export function Alert({
  variant = "info",
  children,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variantClasses[variant],
        className,
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
