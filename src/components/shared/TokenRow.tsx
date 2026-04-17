import { cn } from "@/lib/utils";

interface TokenRowProps {
  name: string;
  value: string;
  preview?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function TokenRow({ name, value, preview, onClick, selected, className }: TokenRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent text-accent-foreground",
        className
      )}
    >
      {preview && <div className="flex-shrink-0">{preview}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground font-mono truncate">{value}</p>
      </div>
    </button>
  );
}
