export type TokenCategory =
  | "colors"
  | "typography"
  | "spacing"
  | "radius"
  | "shadows"
  | "animations";

export interface ColorPalette {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  border: string;
  ring: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
}

export interface TypographyTokens {
  fontSans: string;
  fontMono: string;
  sizeXs: string;
  sizeSm: string;
  sizeMd: string;
  sizeLg: string;
  sizeXl: string;
  size2xl: string;
  weightNormal: string;
  weightMedium: string;
  weightSemibold: string;
  weightBold: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

export interface SpacingTokens {
  base: number;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
}

export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface AnimationTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easeDefault: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  animations: AnimationTokens;
  darkMode: boolean;
}

export interface ComponentPreview {
  id: string;
  name: string;
  category: string;
}
