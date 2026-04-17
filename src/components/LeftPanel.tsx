import { useRef } from "react";
import { Download } from "lucide-react";
import type { DesignSystem } from "@/types";

interface LeftPanelProps {
  designSystem: DesignSystem;
  setDesignSystem: (ds: DesignSystem) => void;
  onExport: () => void;
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)',
          cursor: 'pointer',
        }}
        onClick={() => inputRef.current?.click()}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: value,
            border: '1px solid rgba(0,0,0,0.1)',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--foreground)', flex: 1 }}>
          {value}
        </span>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}

const FONT_OPTIONS = [
  'Plus Jakarta Sans, sans-serif',
  'Inter, sans-serif',
  'DM Sans, sans-serif',
  'Geist, sans-serif',
  'Manrope, sans-serif',
  'Outfit, sans-serif',
];

const SCALE_RATIOS = [
  { label: 'Minor Second (1.067)', value: 1.067 },
  { label: 'Major Second (1.125)', value: 1.125 },
  { label: 'Minor Third (1.200)', value: 1.2 },
  { label: 'Major Third (1.250)', value: 1.25 },
  { label: 'Perfect Fourth (1.333)', value: 1.333 },
  { label: 'Augmented Fourth (1.414)', value: 1.414 },
  { label: 'Perfect Fifth (1.500)', value: 1.5 },
];

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--card)',
  color: 'var(--foreground)',
  fontSize: '13px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '32px',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--muted-foreground)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '12px',
};

export function LeftPanel({ designSystem, setDesignSystem, onExport }: LeftPanelProps) {
  const update = (key: keyof DesignSystem, value: string | number) => {
    setDesignSystem({ ...designSystem, [key]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Project Name */}
        <div>
          <p style={sectionLabelStyle}>Project Name</p>
          <input
            type="text"
            value={designSystem.projectName}
            onChange={(e) => update('projectName', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Brand Colors */}
        <div>
          <p style={sectionLabelStyle}>Brand Colors</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <ColorInput label="Primary" value={designSystem.primaryColor} onChange={(v) => update('primaryColor', v)} />
            <ColorInput label="Secondary" value={designSystem.secondaryColor} onChange={(v) => update('secondaryColor', v)} />
            <ColorInput label="Neutral" value={designSystem.neutralColor} onChange={(v) => update('neutralColor', v)} />
            <ColorInput label="Success" value={designSystem.successColor} onChange={(v) => update('successColor', v)} />
            <ColorInput label="Warning" value={designSystem.warningColor} onChange={(v) => update('warningColor', v)} />
            <ColorInput label="Error" value={designSystem.errorColor} onChange={(v) => update('errorColor', v)} />
          </div>
        </div>

        {/* Typography */}
        <div>
          <p style={sectionLabelStyle}>Typography</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px' }}>Heading Font</label>
              <select
                value={designSystem.headingFont}
                onChange={(e) => update('headingFont', e.target.value)}
                style={selectStyle}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f} value={f}>{f.split(',')[0]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px' }}>Body Font</label>
              <select
                value={designSystem.fontFamily}
                onChange={(e) => update('fontFamily', e.target.value)}
                style={selectStyle}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f} value={f}>{f.split(',')[0]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px' }}>
                Base Size: {designSystem.baseFontSize}px
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => update('baseFontSize', Math.max(12, designSystem.baseFontSize - 1))}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)',
                    backgroundColor: 'var(--card)', color: 'var(--foreground)', cursor: 'pointer',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >−</button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>
                  {designSystem.baseFontSize}px
                </span>
                <button
                  onClick={() => update('baseFontSize', Math.min(24, designSystem.baseFontSize + 1))}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)',
                    backgroundColor: 'var(--card)', color: 'var(--foreground)', cursor: 'pointer',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px' }}>Scale Ratio</label>
              <select
                value={designSystem.typeScaleRatio}
                onChange={(e) => update('typeScaleRatio', parseFloat(e.target.value))}
                style={selectStyle}
              >
                {SCALE_RATIOS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <p style={sectionLabelStyle}>Spacing</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[4, 8].map(val => (
              <button
                key={val}
                onClick={() => update('baseSpacing', val)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px',
                  border: `1px solid ${designSystem.baseSpacing === val ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: designSystem.baseSpacing === val ? 'var(--primary)' : 'var(--card)',
                  color: designSystem.baseSpacing === val ? '#FFFFFF' : 'var(--foreground)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'var(--font-sans)',
                }}
              >
                {val}px
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <p style={sectionLabelStyle}>Border Radius</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="range"
              min={0}
              max={32}
              value={designSystem.borderRadius}
              onChange={(e) => update('borderRadius', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>0px</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{designSystem.borderRadius}px</span>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>32px</span>
            </div>
            <div style={{
              height: '40px', width: '100%', backgroundColor: 'var(--primary)',
              borderRadius: `${designSystem.borderRadius}px`,
              opacity: 0.2,
            }} />
          </div>
        </div>

        {/* Elevation */}
        <div>
          <p style={sectionLabelStyle}>Elevation</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['none', 'soft', 'lifted'] as const).map(val => (
              <button
                key={val}
                onClick={() => update('elevation', val)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px',
                  border: `1px solid ${designSystem.elevation === val ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: designSystem.elevation === val ? 'var(--primary)' : 'var(--card)',
                  color: designSystem.elevation === val ? '#FFFFFF' : 'var(--foreground)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: '500', fontFamily: 'var(--font-sans)',
                  textTransform: 'capitalize',
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Export button */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={onExport}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Download size={16} />
          Export Design Tokens
        </button>
      </div>
    </div>
  );
}
