import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterCanvas } from "@/components/CenterCanvas";
import { RightPanel } from "@/components/RightPanel";
import { ExportModal } from "@/components/ExportModal";
import type { DesignTokens, TokenCategory } from "@/types";
import { DEFAULT_TOKENS } from "@/lib/defaults";

export default function App() {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_TOKENS);
  const [activeCategory, setActiveCategory] = useState<TokenCategory>("colors");
  const [exportOpen, setExportOpen] = useState(false);

  const handleToggleDark = () => {
    setTokens((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
      colors: prev.darkMode
        ? DEFAULT_TOKENS.colors
        : {
            background: "240 10% 3.9%",
            foreground: "0 0% 98%",
            card: "240 10% 3.9%",
            cardForeground: "0 0% 98%",
            popover: "240 10% 3.9%",
            popoverForeground: "0 0% 98%",
            primary: "0 0% 98%",
            primaryForeground: "240 5.9% 10%",
            secondary: "240 3.7% 15.9%",
            secondaryForeground: "0 0% 98%",
            muted: "240 3.7% 15.9%",
            mutedForeground: "240 5% 64.9%",
            accent: "240 3.7% 15.9%",
            accentForeground: "0 0% 98%",
            destructive: "0 62.8% 30.6%",
            border: "240 3.7% 15.9%",
            ring: "240 4.9% 83.9%",
          },
    }));
  };

  const handleReset = () => {
    setTokens(DEFAULT_TOKENS);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/80 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <svg
                className="h-3.5 w-3.5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">Design System Generator</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Build and export your design tokens</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-accent transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Export Tokens
            </button>
          </div>
        </header>

        {/* Main three-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <CenterCanvas
            tokens={tokens}
            activeCategory={activeCategory}
            onToggleDark={handleToggleDark}
            onReset={handleReset}
          />
          <RightPanel
            tokens={tokens}
            activeCategory={activeCategory}
            onChange={setTokens}
            onExport={() => setExportOpen(true)}
          />
        </div>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} tokens={tokens} />
    </TooltipProvider>
  );
}
