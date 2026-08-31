import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "min-h-[160px] w-full rounded-lg border border-border bg-surface/50 px-4 py-3 text-foreground placeholder:text-muted shadow-sm transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
