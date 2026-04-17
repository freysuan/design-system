import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PanelHeader } from "@/components/shared/PanelHeader";
import type { DesignTokens, TokenCategory } from "@/types";
import { hslToHex } from "@/lib/utils";
import { Moon, Sun, RefreshCw } from "lucide-react";

interface CenterCanvasProps {
  tokens: DesignTokens;
  activeCategory: TokenCategory;
  onToggleDark: () => void;
  onReset: () => void;
}

export function CenterCanvas({ tokens, activeCategory, onToggleDark, onReset }: CenterCanvasProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    const el = previewRef.current;
    const { colors, radius } = tokens;
    el.style.setProperty("--background", colors.background);
    el.style.setProperty("--foreground", colors.foreground);
    el.style.setProperty("--card", colors.card);
    el.style.setProperty("--card-foreground", colors.cardForeground);
    el.style.setProperty("--primary", colors.primary);
    el.style.setProperty("--primary-foreground", colors.primaryForeground);
    el.style.setProperty("--secondary", colors.secondary);
    el.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    el.style.setProperty("--muted", colors.muted);
    el.style.setProperty("--muted-foreground", colors.mutedForeground);
    el.style.setProperty("--accent", colors.accent);
    el.style.setProperty("--accent-foreground", colors.accentForeground);
    el.style.setProperty("--destructive", colors.destructive);
    el.style.setProperty("--border", colors.border);
    el.style.setProperty("--input", colors.border);
    el.style.setProperty("--ring", colors.ring);
    el.style.setProperty("--radius", radius.md);
  }, [tokens]);

  return (
    <main className="flex-1 flex flex-col min-w-0 h-full">
      <PanelHeader
        title="Preview"
        description={`Viewing: ${activeCategory}`}
        actions={
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleDark}>
              {tokens.darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReset}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div
            ref={previewRef}
            className="rounded-xl border border-border overflow-hidden"
            style={{ background: `hsl(var(--background))` }}
          >
            {activeCategory === "colors" && <ColorPreview tokens={tokens} />}
            {activeCategory === "typography" && <TypographyPreview tokens={tokens} />}
            {activeCategory === "spacing" && <SpacingPreview tokens={tokens} />}
            {activeCategory === "radius" && <RadiusPreview tokens={tokens} />}
            {activeCategory === "shadows" && <ShadowPreview tokens={tokens} />}
            {activeCategory === "animations" && <AnimationPreview tokens={tokens} />}
          </div>

          <div className="mt-6">
            <ComponentShowcase tokens={tokens} />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}

function ColorPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors } = tokens;
  const colorEntries: [string, string][] = [
    ["Background", colors.background],
    ["Foreground", colors.foreground],
    ["Primary", colors.primary],
    ["Primary FG", colors.primaryForeground],
    ["Secondary", colors.secondary],
    ["Secondary FG", colors.secondaryForeground],
    ["Accent", colors.accent],
    ["Accent FG", colors.accentForeground],
    ["Muted", colors.muted],
    ["Muted FG", colors.mutedForeground],
    ["Destructive", colors.destructive],
    ["Border", colors.border],
    ["Card", colors.card],
    ["Ring", colors.ring],
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Color Palette
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {colorEntries.map(([name, value]) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div
              className="h-14 rounded-lg border"
              style={{
                backgroundColor: `hsl(${value})`,
                borderColor: `hsl(${colors.border})`,
              }}
            />
            <div>
              <p className="text-xs font-medium" style={{ color: `hsl(${colors.foreground})` }}>
                {name}
              </p>
              <p className="text-xs font-mono" style={{ color: `hsl(${colors.mutedForeground})` }}>
                {hslToHex(value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-5" style={{ backgroundColor: `hsl(${colors.border})` }} />

      <div className="flex flex-wrap gap-2">
        {["Primary", "Secondary", "Outline", "Ghost", "Destructive"].map((v) => (
          <button
            key={v}
            className="px-4 py-2 text-sm font-medium rounded-md transition-opacity hover:opacity-90"
            style={
              v === "Primary"
                ? { background: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})` }
                : v === "Secondary"
                ? { background: `hsl(${colors.secondary})`, color: `hsl(${colors.secondaryForeground})` }
                : v === "Outline"
                ? { border: `1px solid hsl(${colors.border})`, color: `hsl(${colors.foreground})`, background: "transparent" }
                : v === "Ghost"
                ? { color: `hsl(${colors.foreground})`, background: "transparent" }
                : { background: `hsl(${colors.destructive})`, color: `hsl(${colors.primaryForeground})` }
            }
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypographyPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors, typography } = tokens;
  const sizes = [
    { label: "2xl", value: typography.size2xl, weight: typography.weightBold },
    { label: "xl", value: typography.sizeXl, weight: typography.weightSemibold },
    { label: "lg", value: typography.sizeLg, weight: typography.weightMedium },
    { label: "md", value: typography.sizeMd, weight: typography.weightNormal },
    { label: "sm", value: typography.sizeSm, weight: typography.weightNormal },
    { label: "xs", value: typography.sizeXs, weight: typography.weightNormal },
  ];

  return (
    <div className="p-6" style={{ fontFamily: typography.fontSans }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Typography Scale
      </h3>
      <div className="space-y-4">
        {sizes.map(({ label, value, weight }) => (
          <div
            key={label}
            className="flex items-baseline gap-4 pb-4 border-b"
            style={{ borderColor: `hsl(${colors.border})` }}
          >
            <span
              className="text-xs uppercase tracking-wider w-8 flex-shrink-0"
              style={{ color: `hsl(${colors.mutedForeground})` }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: value,
                fontWeight: weight,
                color: `hsl(${colors.foreground})`,
                lineHeight: typography.lineHeightNormal,
              }}
            >
              The quick brown fox
            </span>
            <span className="ml-auto text-xs font-mono" style={{ color: `hsl(${colors.mutedForeground})` }}>
              {value} / {weight}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-lg" style={{ background: `hsl(${colors.muted})` }}>
        <p
          className="leading-relaxed"
          style={{
            fontFamily: typography.fontMono,
            fontSize: typography.sizeSm,
            color: `hsl(${colors.mutedForeground})`,
          }}
        >
          Monospace: {typography.fontMono}
        </p>
      </div>
    </div>
  );
}

function SpacingPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors, spacing } = tokens;
  const steps: [string, string][] = [
    ["xs", spacing.xs],
    ["sm", spacing.sm],
    ["md", spacing.md],
    ["lg", spacing.lg],
    ["xl", spacing.xl],
    ["2xl", spacing["2xl"]],
    ["3xl", spacing["3xl"]],
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Spacing Scale (base: {spacing.base}px)
      </h3>
      <div className="space-y-3">
        {steps.map(([label, value]) => (
          <div key={label} className="flex items-center gap-4">
            <span
              className="text-xs font-mono w-6 flex-shrink-0"
              style={{ color: `hsl(${colors.mutedForeground})` }}
            >
              {label}
            </span>
            <div
              className="h-6 rounded"
              style={{
                width: value,
                minWidth: "4px",
                background: `hsl(${colors.primary})`,
                opacity: 0.7,
              }}
            />
            <span className="text-xs font-mono" style={{ color: `hsl(${colors.mutedForeground})` }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadiusPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors, radius } = tokens;
  const steps: [string, string][] = [
    ["none", radius.none],
    ["sm", radius.sm],
    ["md", radius.md],
    ["lg", radius.lg],
    ["xl", radius.xl],
    ["full", radius.full],
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Border Radius
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {steps.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className="h-16 w-16 border-2"
              style={{
                borderRadius: value,
                borderColor: `hsl(${colors.primary})`,
                background: `hsl(${colors.primary}/0.1)`,
              }}
            />
            <span className="text-xs font-medium" style={{ color: `hsl(${colors.foreground})` }}>
              {label}
            </span>
            <span className="text-xs font-mono" style={{ color: `hsl(${colors.mutedForeground})` }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShadowPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors, shadows } = tokens;
  const steps: [string, string][] = [
    ["none", shadows.none],
    ["sm", shadows.sm],
    ["md", shadows.md],
    ["lg", shadows.lg],
    ["xl", shadows.xl],
    ["2xl", shadows["2xl"]],
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Shadow Tokens
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {steps.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center gap-3 p-4">
            <div
              className="h-16 w-full rounded-lg"
              style={{
                boxShadow: value,
                background: `hsl(${colors.card})`,
                border: `1px solid hsl(${colors.border})`,
              }}
            />
            <span className="text-xs font-medium" style={{ color: `hsl(${colors.foreground})` }}>
              shadow-{label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimationPreview({ tokens }: { tokens: DesignTokens }) {
  const { colors, animations } = tokens;

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: `hsl(${colors.foreground})` }}>
        Animation Tokens
      </h3>
      <div className="space-y-4">
        {[
          { label: "Fast", duration: animations.durationFast, easing: animations.easeOut },
          { label: "Normal", duration: animations.durationNormal, easing: animations.easeDefault },
          { label: "Slow", duration: animations.durationSlow, easing: animations.easeInOut },
        ].map(({ label, duration, easing }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-3 rounded-lg border"
            style={{ borderColor: `hsl(${colors.border})` }}
          >
            <div
              className="h-8 w-8 rounded-md flex-shrink-0"
              style={{
                background: `hsl(${colors.primary})`,
                animation: `pulse ${duration} ${easing} infinite`,
              }}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: `hsl(${colors.foreground})` }}>
                {label}
              </p>
              <p className="text-xs font-mono" style={{ color: `hsl(${colors.mutedForeground})` }}>
                {duration} — {easing}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentShowcase({ tokens }: { tokens: DesignTokens }) {
  const { colors, radius, shadows } = tokens;

  return (
    <div
      className="rounded-xl border p-6 space-y-5"
      style={{
        background: `hsl(${colors.card})`,
        borderColor: `hsl(${colors.border})`,
        boxShadow: shadows.sm,
      }}
    >
      <div style={{ color: `hsl(${colors.cardForeground})` }}>
        <h3 className="text-base font-semibold mb-1">Component Preview</h3>
        <p className="text-sm" style={{ color: `hsl(${colors.mutedForeground})` }}>
          Live preview of UI components with your current tokens
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Default", "Secondary", "Outline", "Ghost"].map((v) => (
          <button
            key={v}
            className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              borderRadius: radius.md,
              ...(v === "Default"
                ? { background: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})` }
                : v === "Secondary"
                ? { background: `hsl(${colors.secondary})`, color: `hsl(${colors.secondaryForeground})` }
                : v === "Outline"
                ? { border: `1px solid hsl(${colors.border})`, color: `hsl(${colors.foreground})`, background: "transparent" }
                : { color: `hsl(${colors.foreground})`, background: "transparent" }),
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["Default", "Secondary", "Outline", "Destructive"].map((v) => (
          <span
            key={v}
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold"
            style={{
              borderRadius: "9999px",
              border: `1px solid`,
              ...(v === "Default"
                ? { background: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})`, borderColor: "transparent" }
                : v === "Secondary"
                ? { background: `hsl(${colors.secondary})`, color: `hsl(${colors.secondaryForeground})`, borderColor: "transparent" }
                : v === "Outline"
                ? { color: `hsl(${colors.foreground})`, borderColor: `hsl(${colors.border})` }
                : { background: `hsl(${colors.destructive})`, color: `hsl(${colors.primaryForeground})`, borderColor: "transparent" }),
            }}
          >
            {v}
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Input preview..."
        className="w-full px-3 py-2 text-sm outline-none transition-shadow"
        style={{
          borderRadius: radius.md,
          border: `1px solid hsl(${colors.border})`,
          background: `hsl(${colors.background})`,
          color: `hsl(${colors.foreground})`,
          boxShadow: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px hsl(${colors.ring})`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
