import { cn } from "@/lib/utils";
import { hslToHex } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorSwatchProps {
  name: string;
  value: string;
  onClick?: () => void;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ColorSwatch({ name, value, onClick, selected, size = "md" }: ColorSwatchProps) {
  const hex = hslToHex(value);
  const sizeClasses = {
    sm: "h-6 w-6 rounded",
    md: "h-8 w-8 rounded-md",
    lg: "h-10 w-10 rounded-md",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            sizeClasses[size],
            "border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            selected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border/50"
          )}
          style={{ backgroundColor: `hsl(${value})` }}
          aria-label={`${name}: ${hex}`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{hex}</p>
        <p className="text-xs text-muted-foreground font-mono">hsl({value})</p>
      </TooltipContent>
    </Tooltip>
  );
}
