import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PanelHeader } from "@/components/shared/PanelHeader";
import { ControlRow } from "@/components/shared/ControlRow";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ColorSwatch } from "@/components/shared/ColorSwatch";
import type { DesignTokens, TokenCategory } from "@/types";
import { hexToHsl, hslToHex } from "@/lib/utils";
import { PRESET_THEMES } from "@/lib/defaults";

interface RightPanelProps {
  tokens: DesignTokens;
  activeCategory: TokenCategory;
  onChange: (tokens: DesignTokens) => void;
  onExport: () => void;
}

export function RightPanel({ tokens, activeCategory, onChange, onExport }: RightPanelProps) {
  const updateColor = (key: keyof DesignTokens["colors"], hex: string) => {
    onChange({
      ...tokens,
      colors: { ...tokens.colors, [key]: hexToHsl(hex) },
    });
  };

  const updateTypography = (key: keyof DesignTokens["typography"], value: string) => {
    onChange({ ...tokens, typography: { ...tokens.typography, [key]: value } });
  };

  const updateRadius = (key: keyof DesignTokens["radius"], value: string) => {
    onChange({ ...tokens, radius: { ...tokens.radius, [key]: value } });
  };

  const updateSpacingBase = (value: number) => {
    onChange({
      ...tokens,
      spacing: {
        ...tokens.spacing,
        base: value,
        xs: `${value * 0.25}px`,
        sm: `${value * 0.5}px`,
        md: `${value}px`,
        lg: `${value * 1.5}px`,
        xl: `${value * 2}px`,
        "2xl": `${value * 3}px`,
        "3xl": `${value * 4}px`,
      },
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_THEMES[presetKey];
    if (!preset) return;
    onChange({ ...tokens, colors: { ...tokens.colors, ...preset } });
  };

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-l border-border h-full">
      <PanelHeader
        title="Properties"
        description={`Edit ${activeCategory}`}
        actions={
          <button
            onClick={onExport}
            className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Export
          </button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {activeCategory === "colors" && (
            <ColorsPanel tokens={tokens} onColorChange={updateColor} onPreset={applyPreset} />
          )}
          {activeCategory === "typography" && (
            <TypographyPanel tokens={tokens} onChange={updateTypography} />
          )}
          {activeCategory === "spacing" && (
            <SpacingPanel tokens={tokens} onBaseChange={updateSpacingBase} />
          )}
          {activeCategory === "radius" && (
            <RadiusPanel tokens={tokens} onChange={updateRadius} />
          )}
          {activeCategory === "shadows" && (
            <ShadowsPanel tokens={tokens} />
          )}
          {activeCategory === "animations" && (
            <AnimationsPanel tokens={tokens} />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

function ColorsPanel({
  tokens,
  onColorChange,
  onPreset,
}: {
  tokens: DesignTokens;
  onColorChange: (key: keyof DesignTokens["colors"], hex: string) => void;
  onPreset: (key: string) => void;
}) {
  const colorFields: { key: keyof DesignTokens["colors"]; label: string }[] = [
    { key: "background", label: "Background" },
    { key: "foreground", label: "Foreground" },
    { key: "primary", label: "Primary" },
    { key: "primaryForeground", label: "Primary Foreground" },
    { key: "secondary", label: "Secondary" },
    { key: "secondaryForeground", label: "Secondary Foreground" },
    { key: "accent", label: "Accent" },
    { key: "accentForeground", label: "Accent Foreground" },
    { key: "muted", label: "Muted" },
    { key: "mutedForeground", label: "Muted Foreground" },
    { key: "destructive", label: "Destructive" },
    { key: "border", label: "Border" },
    { key: "ring", label: "Ring" },
  ];

  return (
    <>
      <div>
        <SectionHeading>Presets</SectionHeading>
        <div className="flex flex-wrap gap-2 px-3 pt-1">
          {Object.keys(PRESET_THEMES).map((key) => (
            <button
              key={key}
              onClick={() => onPreset(key)}
              className="px-2.5 py-1 text-xs rounded-md border border-border hover:bg-accent capitalize transition-colors"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <SectionHeading>Color Tokens</SectionHeading>
        <div className="space-y-2 px-3">
          {colorFields.map(({ key, label }) => (
            <ControlRow key={key} label={label} htmlFor={`color-${key}`}>
              <div className="flex items-center gap-2">
                <ColorSwatch name={label} value={tokens.colors[key]} size="sm" />
                <input
                  id={`color-${key}`}
                  type="color"
                  value={hslToHex(tokens.colors[key])}
                  onChange={(e) => onColorChange(key, e.target.value)}
                  className="sr-only"
                />
                <label
                  htmlFor={`color-${key}`}
                  className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground transition-colors w-[5.5rem] truncate"
                >
                  {hslToHex(tokens.colors[key])}
                </label>
              </div>
            </ControlRow>
          ))}
        </div>
      </div>
    </>
  );
}

function TypographyPanel({
  tokens,
  onChange,
}: {
  tokens: DesignTokens;
  onChange: (key: keyof DesignTokens["typography"], value: string) => void;
}) {
  const FONT_OPTIONS = ["Inter", "Geist", "DM Sans", "Plus Jakarta Sans", "Nunito", "Poppins", "Roboto"];
  const MONO_OPTIONS = ["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code", "Geist Mono"];

  return (
    <>
      <div>
        <SectionHeading>Font Families</SectionHeading>
        <div className="space-y-3 px-3">
          <ControlRow label="Sans-Serif" vertical>
            <Select value={tokens.typography.fontSans} onValueChange={(v) => onChange("fontSans", v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>

          <ControlRow label="Monospace" vertical>
            <Select value={tokens.typography.fontMono} onValueChange={(v) => onChange("fontMono", v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONO_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>
        </div>
      </div>

      <Separator />

      <div>
        <SectionHeading>Type Scale</SectionHeading>
        <div className="space-y-3 px-3">
          {[
            { key: "sizeXs" as const, label: "XS" },
            { key: "sizeSm" as const, label: "SM" },
            { key: "sizeMd" as const, label: "MD (base)" },
            { key: "sizeLg" as const, label: "LG" },
            { key: "sizeXl" as const, label: "XL" },
            { key: "size2xl" as const, label: "2XL" },
          ].map(({ key, label }) => (
            <ControlRow key={key} label={label} htmlFor={`type-${key}`}>
              <Input
                id={`type-${key}`}
                value={tokens.typography[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="h-7 w-24 text-xs font-mono text-right"
              />
            </ControlRow>
          ))}
        </div>
      </div>
    </>
  );
}

function SpacingPanel({
  tokens,
  onBaseChange,
}: {
  tokens: DesignTokens;
  onBaseChange: (v: number) => void;
}) {
  return (
    <>
      <div>
        <SectionHeading>Base Unit</SectionHeading>
        <div className="px-3 space-y-3">
          <ControlRow label={`${tokens.spacing.base}px`}>
            <span className="text-xs text-muted-foreground font-mono">base</span>
          </ControlRow>
          <Slider
            value={[tokens.spacing.base]}
            onValueChange={([v]) => onBaseChange(v)}
            min={2}
            max={8}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2px</span>
            <span>4px (default)</span>
            <span>8px</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <SectionHeading>Scale Preview</SectionHeading>
        <div className="space-y-2 px-3">
          {(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((key) => (
            <ControlRow key={key} label={key} htmlFor={`spacing-${key}`}>
              <Input
                id={`spacing-${key}`}
                value={tokens.spacing[key]}
                readOnly
                className="h-7 w-20 text-xs font-mono text-right bg-muted"
              />
            </ControlRow>
          ))}
        </div>
      </div>
    </>
  );
}

function RadiusPanel({
  tokens,
  onChange,
}: {
  tokens: DesignTokens;
  onChange: (key: keyof DesignTokens["radius"], value: string) => void;
}) {
  const fields: { key: keyof DesignTokens["radius"]; label: string }[] = [
    { key: "none", label: "None" },
    { key: "sm", label: "Small" },
    { key: "md", label: "Medium" },
    { key: "lg", label: "Large" },
    { key: "xl", label: "X-Large" },
    { key: "full", label: "Full / Pill" },
  ];

  return (
    <div>
      <SectionHeading>Border Radius Tokens</SectionHeading>
      <div className="space-y-2 px-3">
        {fields.map(({ key, label }) => (
          <ControlRow key={key} label={label} htmlFor={`radius-${key}`}>
            <Input
              id={`radius-${key}`}
              value={tokens.radius[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="h-7 w-24 text-xs font-mono text-right"
            />
          </ControlRow>
        ))}
      </div>
    </div>
  );
}

function ShadowsPanel({ tokens }: { tokens: DesignTokens }) {
  return (
    <div>
      <SectionHeading>Shadow Tokens</SectionHeading>
      <div className="space-y-3 px-3">
        {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((key) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs capitalize">{key === "none" ? "None" : `Shadow ${key}`}</Label>
            <Input
              value={tokens.shadows[key]}
              readOnly
              className="h-7 text-xs font-mono bg-muted"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimationsPanel({ tokens }: { tokens: DesignTokens }) {
  return (
    <div className="space-y-4">
      <div>
        <SectionHeading>Durations</SectionHeading>
        <div className="space-y-2 px-3">
          {[
            { key: "durationFast" as const, label: "Fast" },
            { key: "durationNormal" as const, label: "Normal" },
            { key: "durationSlow" as const, label: "Slow" },
          ].map(({ key, label }) => (
            <ControlRow key={key} label={label}>
              <Input value={tokens.animations[key]} readOnly className="h-7 w-20 text-xs font-mono text-right bg-muted" />
            </ControlRow>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <SectionHeading>Easing</SectionHeading>
        <div className="space-y-2 px-3">
          {[
            { key: "easeDefault" as const, label: "Default" },
            { key: "easeIn" as const, label: "Ease In" },
            { key: "easeOut" as const, label: "Ease Out" },
            { key: "easeInOut" as const, label: "Ease In-Out" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input value={tokens.animations[key]} readOnly className="h-7 text-xs font-mono bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
