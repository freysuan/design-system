import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h3 className={cn("px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </h3>
  );
}
