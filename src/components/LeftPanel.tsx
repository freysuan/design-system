import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PanelHeader } from "@/components/shared/PanelHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { TokenCategory } from "@/types";
import {
  Palette,
  Type,
  Space,
  Circle,
  Layers,
  Zap,
  LayoutTemplate,
  ChevronRight,
} from "lucide-react";

interface LeftPanelProps {
  activeCategory: TokenCategory;
  onCategoryChange: (category: TokenCategory) => void;
}

const TOKEN_CATEGORIES: { id: TokenCategory; label: string; icon: React.ElementType; description: string }[] = [
  { id: "colors", label: "Colors", icon: Palette, description: "Brand & semantic colors" },
  { id: "typography", label: "Typography", icon: Type, description: "Fonts, sizes & weights" },
  { id: "spacing", label: "Spacing", icon: Space, description: "Padding & margin scale" },
  { id: "radius", label: "Border Radius", icon: Circle, description: "Corner radius tokens" },
  { id: "shadows", label: "Shadows", icon: Layers, description: "Elevation & shadow tokens" },
  { id: "animations", label: "Animations", icon: Zap, description: "Duration & easing tokens" },
];

const COMPONENT_PREVIEWS = [
  "Button",
  "Input",
  "Card",
  "Badge",
  "Alert",
  "Avatar",
  "Checkbox",
  "Switch",
  "Select",
  "Tabs",
];

export function LeftPanel({ activeCategory, onCategoryChange }: LeftPanelProps) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-sidebar h-full">
      <PanelHeader
        title="Design Tokens"
        description="Customize your design system"
        actions={
          <div className="p-1.5 rounded-md bg-primary/10">
            <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="py-2">
          <SectionHeading>Token Categories</SectionHeading>
          <div className="px-2 space-y-0.5">
            {TOKEN_CATEGORIES.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => onCategoryChange(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all group",
                  activeCategory === id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    activeCategory === id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{label}</p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      activeCategory === id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {description}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 flex-shrink-0 transition-transform",
                    activeCategory === id ? "text-primary-foreground rotate-90" : "text-muted-foreground/0 group-hover:text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>

          <Separator className="my-3" />

          <SectionHeading>Components</SectionHeading>
          <div className="px-2 space-y-0.5">
            {COMPONENT_PREVIEWS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-default transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Design System Generator
        </p>
      </div>
    </aside>
  );
}
