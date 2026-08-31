import { cn } from "@/lib/utils/cn";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full flex-1 px-4 py-10 sm:px-6",
        narrow ? "max-w-2xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </main>
  );
}
