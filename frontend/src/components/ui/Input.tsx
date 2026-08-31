import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-foreground placeholder:text-muted shadow-sm transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-500",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
