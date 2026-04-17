export interface DesignSystem {
  projectName: string;
  primaryColor: string;
  secondaryColor: string;
  neutralColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  fontFamily: string;
  headingFont: string;
  baseFontSize: number;
  typeScaleRatio: number;
  baseSpacing: number;
  borderRadius: number;
  elevation: 'none' | 'soft' | 'lifted';
}
