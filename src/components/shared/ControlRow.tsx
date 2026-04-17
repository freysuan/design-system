import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ControlRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  vertical?: boolean;
}

export function ControlRow({
  label,
  description,
  children,
  htmlFor,
  className,
  vertical = false,
}: ControlRowProps) {
  return (
    <div className={cn(vertical ? "space-y-2" : "flex items-center justify-between gap-4", className)}>
      <div className={vertical ? undefined : "flex-1 min-w-0"}>
        <Label htmlFor={htmlFor} className="text-sm">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className={vertical ? undefined : "flex-shrink-0"}>{children}</div>
    </div>
  );
}
