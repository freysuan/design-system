import { useState } from "react";
import type { DesignSystem } from "@/types";

interface CenterCanvasProps {
  designSystem: DesignSystem;
  previewMode: 'light' | 'dark';
}

function adjustColorBrightness(hex: string, factor: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * (factor - 0.5) * 2);
  const g = ((num >> 8) & 0x00ff) + Math.round((255 - ((num >> 8) & 0x00ff)) * (factor - 0.5) * 2);
  const b = (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * (factor - 0.5) * 2);
  return '#' + (
    0x1000000 +
    (Math.max(0, Math.min(255, r)) << 16) +
    (Math.max(0, Math.min(255, g)) << 8) +
    Math.max(0, Math.min(255, b))
  ).toString(16).slice(1);
}

function generateColorVariants(hex: string) {
  return [
    { shade: 50, lightness: 0.95 },
    { shade: 100, lightness: 0.9 },
    { shade: 200, lightness: 0.8 },
    { shade: 300, lightness: 0.7 },
    { shade: 400, lightness: 0.6 },
    { shade: 500, lightness: 0.5 },
    { shade: 600, lightness: 0.4 },
    { shade: 700, lightness: 0.3 },
    { shade: 800, lightness: 0.2 },
    { shade: 900, lightness: 0.1 },
  ].map(v => ({ shade: v.shade, hex: adjustColorBrightness(hex, v.lightness) }));
}

function SectionTitle({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: isDark ? '#E5E5E5' : '#1C1A18', margin: '0 0 4px 0' }}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <p style={{ fontSize: '14px', color: isDark ? '#999999' : '#666666', margin: '0 0 24px 0' }}>
      {children}
    </p>
  );
}

function Card({ children, isDark, style }: { children: React.ReactNode; isDark: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
      borderRadius: '12px',
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardLabel({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#999999' : '#666666', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '16px', marginTop: 0 }}>
      {children}
    </p>
  );
}

function ColorPaletteRow({ label, hex, isDark, copiedColor, onCopy }: {
  label: string; hex: string; isDark: boolean; copiedColor: string | null; onCopy: (hex: string) => void;
}) {
  const variants = generateColorVariants(hex);
  return (
    <div>
      <p style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#E5E5E5' : '#1C1A18', marginBottom: '8px', marginTop: 0 }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
        {variants.map(v => (
          <div key={v.shade} onClick={() => onCopy(v.hex)} title={`${v.hex}`} style={{
            height: '40px', borderRadius: '6px', backgroundColor: v.hex, cursor: 'pointer',
            border: '1px solid rgba(0,0,0,0.05)', position: 'relative',
          }}>
            {copiedColor === v.hex && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontSize: '10px', color: '#fff', fontWeight: '600' }}>✓</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', marginTop: '4px' }}>
        {variants.map(v => (
          <p key={v.shade} style={{ fontSize: '9px', color: isDark ? '#999' : '#666', textAlign: 'center', margin: 0 }}>{v.shade}</p>
        ))}
      </div>
    </div>
  );
}

function SkeletonBox({ isDark, w, h, r }: { isDark: boolean; w: string; h: string; r: string }) {
  return (
    <div className="skeleton-pulse" style={{ width: w, height: h, borderRadius: r, backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5' }} />
  );
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const CALENDAR_DAYS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

export function CenterCanvas({ designSystem, previewMode }: CenterCanvasProps) {
  const isDark = previewMode === 'dark';
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [activePillTab, setActivePillTab] = useState('all');
  const [activeUnderlineTab, setActiveUnderlineTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(15);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [checkboxStates, setCheckboxStates] = useState({ opt1: true, opt2: false, opt3: true });
  const [radioValue, setRadioValue] = useState('opt1');

  const borderColor = isDark ? '#2A2A2A' : '#E5E5E5';
  const textColor = isDark ? '#E5E5E5' : '#1C1A18';
  const mutedText = isDark ? '#999999' : '#666666';
  const primary = designSystem.primaryColor;
  const progressValue = 65;

  const typeScale = {
    h1: Math.round(designSystem.baseFontSize * Math.pow(designSystem.typeScaleRatio, 3)),
    h2: Math.round(designSystem.baseFontSize * Math.pow(designSystem.typeScaleRatio, 2)),
    h3: Math.round(designSystem.baseFontSize * Math.pow(designSystem.typeScaleRatio, 1)),
    body: designSystem.baseFontSize,
    caption: Math.round(designSystem.baseFontSize / designSystem.typeScaleRatio),
  };

  const shadowStyle = designSystem.elevation === 'none'
    ? 'none'
    : designSystem.elevation === 'soft'
    ? '0 2px 8px rgba(0,0,0,0.08)'
    : '0 8px 24px rgba(0,0,0,0.12)';

  const btnRadius = `${designSystem.borderRadius}px`;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const sec: React.CSSProperties = {
    padding: '32px',
    borderBottom: `1px solid ${borderColor}`,
    fontFamily: designSystem.fontFamily,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: btnRadius,
    border: `1px solid ${borderColor}`,
    backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
    color: textColor, fontSize: '14px', fontFamily: designSystem.fontFamily,
    outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100%', fontFamily: designSystem.fontFamily, backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA' }}>

      {/* 1. COLOR SYSTEM */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Color System</SectionTitle>
        <SectionSubtitle isDark={isDark}>Complete color palette generated from your brand colors</SectionSubtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Brand Colors</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ColorPaletteRow label="Primary" hex={designSystem.primaryColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
              <ColorPaletteRow label="Secondary" hex={designSystem.secondaryColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
              <ColorPaletteRow label="Accent" hex={designSystem.primaryColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Semantic Colors</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ColorPaletteRow label="Success" hex={designSystem.successColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
              <ColorPaletteRow label="Warning" hex={designSystem.warningColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
              <ColorPaletteRow label="Error" hex={designSystem.errorColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
              <ColorPaletteRow label="Info" hex="#3B82F6" isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Neutral</CardLabel>
            <ColorPaletteRow label="Neutral" hex={designSystem.neutralColor} isDark={isDark} copiedColor={copiedColor} onCopy={handleCopyColor} />
          </Card>
        </div>
      </div>

      {/* 2. TYPOGRAPHY */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Typography</SectionTitle>
        <SectionSubtitle isDark={isDark}>Font families and type scale for your design system</SectionSubtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Heading Font', font: designSystem.headingFont, weight: 700 },
              { label: 'Body Font', font: designSystem.fontFamily, weight: 400 },
            ].map(({ label, font, weight }) => (
              <Card key={label} isDark={isDark}>
                <CardLabel isDark={isDark}>{label}</CardLabel>
                <p style={{ fontSize: '32px', fontWeight: weight, fontFamily: font, color: textColor, margin: '0 0 4px 0', lineHeight: 1.2 }}>Aa</p>
                <p style={{ fontSize: '13px', color: mutedText, margin: 0, fontFamily: font }}>{font.split(',')[0]}</p>
              </Card>
            ))}
          </div>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Font Stack</CardLabel>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: textColor, backgroundColor: isDark ? '#0A0A0A' : '#F8F8F8', padding: '12px', borderRadius: '8px', lineHeight: 1.7 }}>
              <span style={{ color: '#8d1ff4' }}>--font-heading</span>: <span style={{ color: isDark ? '#86efac' : '#16a34a' }}>'{designSystem.headingFont}'</span>;<br />
              <span style={{ color: '#8d1ff4' }}>--font-body</span>: <span style={{ color: isDark ? '#86efac' : '#16a34a' }}>'{designSystem.fontFamily}'</span>;
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Font Sizes</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'H1', size: typeScale.h1, weight: 700 },
                { label: 'H2', size: typeScale.h2, weight: 700 },
                { label: 'H3', size: typeScale.h3, weight: 600 },
                { label: 'Body', size: typeScale.body, weight: 400 },
                { label: 'Caption', size: typeScale.caption, weight: 400 },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '12px', color: mutedText, width: '52px', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</span>
                  <span style={{ flex: 1, fontSize: `${item.size}px`, fontWeight: item.weight, fontFamily: designSystem.headingFont, color: textColor, lineHeight: 1.2, overflow: 'hidden', whiteSpace: 'nowrap' as const, textOverflow: 'ellipsis' }}>The quick brown fox</span>
                  <span style={{ fontSize: '12px', color: mutedText, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>{item.size}px</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 3. FONT WEIGHTS */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Font Weights</SectionTitle>
        <SectionSubtitle isDark={isDark}>Available font weights in your design system</SectionSubtitle>
        <Card isDark={isDark}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[300, 400, 500, 600, 700, 800].map(w => (
              <div key={w} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: w, fontFamily: designSystem.fontFamily, color: textColor }}>
                  {{ 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extrabold' }[w]} — The quick brown fox
                </span>
                <span style={{ fontSize: '12px', color: mutedText, fontFamily: 'JetBrains Mono, monospace' }}>{w}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. BUTTON VARIANTS */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Button Variants</SectionTitle>
        <SectionSubtitle isDark={isDark}>Button styles and size variations</SectionSubtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Variants</CardLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {[
                { label: 'Default', bg: primary, color: '#fff', border: 'none' },
                { label: 'Secondary', bg: isDark ? '#2A2A2A' : '#F5F5F5', color: textColor, border: 'none' },
                { label: 'Outline', bg: 'transparent', color: primary, border: `1.5px solid ${primary}` },
                { label: 'Ghost', bg: 'transparent', color: textColor, border: 'none' },
                { label: 'Destructive', bg: '#EF4444', color: '#fff', border: 'none' },
              ].map(btn => (
                <button key={btn.label} style={{ padding: '10px 20px', borderRadius: btnRadius, border: btn.border, backgroundColor: btn.bg, color: btn.color, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: designSystem.fontFamily, boxShadow: shadowStyle }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Sizes</CardLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button style={{ padding: '6px 12px', borderRadius: btnRadius, border: 'none', backgroundColor: primary, color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: designSystem.fontFamily }}>Small</button>
              <button style={{ padding: '10px 20px', borderRadius: btnRadius, border: 'none', backgroundColor: primary, color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: designSystem.fontFamily }}>Medium</button>
              <button style={{ padding: '14px 28px', borderRadius: btnRadius, border: 'none', backgroundColor: primary, color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: designSystem.fontFamily }}>Large</button>
              <button style={{ width: '40px', height: '40px', borderRadius: btnRadius, border: 'none', backgroundColor: primary, color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: designSystem.fontFamily }}>+</button>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. INTERACTIVE COMPONENTS */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Interactive Components</SectionTitle>
        <SectionSubtitle isDark={isDark}>Calendar, tabs, accordion, and progress components</SectionSubtitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Calendar */}
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Calendar</CardLabel>
            <div style={{ fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <button style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', fontSize: '16px', padding: '4px 8px' }}>‹</button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>January 2025</span>
                <button style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', fontSize: '16px', padding: '4px 8px' }}>›</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: mutedText, padding: '4px 0' }}>{d}</div>)}
              </div>
              {CALENDAR_DAYS.map((week, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                  {week.map((day, di) => (
                    <div key={di} onClick={() => day && setSelectedDate(day)} style={{
                      textAlign: 'center', padding: '5px', borderRadius: '6px', fontSize: '12px',
                      cursor: day ? 'pointer' : 'default',
                      backgroundColor: day === selectedDate ? primary : 'transparent',
                      color: day === selectedDate ? '#fff' : day ? textColor : 'transparent',
                      fontWeight: day === selectedDate ? '600' : '400',
                    }}>{day ?? ''}</div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Standard Tabs</CardLabel>
              <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5', borderRadius: '10px' }}>
                {['preview', 'code', 'docs'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '7px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? (isDark ? '#2A2A2A' : '#FFFFFF') : 'transparent',
                    color: activeTab === tab ? textColor : mutedText,
                    fontSize: '13px', fontWeight: activeTab === tab ? '600' : '400', fontFamily: designSystem.fontFamily,
                    boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                ))}
              </div>
            </Card>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Pill Tabs</CardLabel>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                {['all', 'active', 'draft', 'archived'].map(tab => (
                  <button key={tab} onClick={() => setActivePillTab(tab)} style={{
                    padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    backgroundColor: activePillTab === tab ? primary : (isDark ? '#2A2A2A' : '#F5F5F5'),
                    color: activePillTab === tab ? '#fff' : textColor,
                    fontSize: '13px', fontWeight: '500', fontFamily: designSystem.fontFamily,
                  }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                ))}
              </div>
            </Card>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Underline Tabs</CardLabel>
              <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${borderColor}` }}>
                {['overview', 'analytics', 'settings'].map(tab => (
                  <button key={tab} onClick={() => setActiveUnderlineTab(tab)} style={{
                    padding: '8px 16px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
                    color: activeUnderlineTab === tab ? primary : mutedText,
                    fontSize: '13px', fontWeight: activeUnderlineTab === tab ? '600' : '400', fontFamily: designSystem.fontFamily,
                    borderBottom: activeUnderlineTab === tab ? `2px solid ${primary}` : '2px solid transparent',
                    marginBottom: '-1px',
                  }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          {/* Accordion */}
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Accordion</CardLabel>
            <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
              {[
                { title: 'What is a design system?', content: 'A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any application.' },
                { title: 'How to use design tokens?' },
                { title: 'Exporting your tokens' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: i < 2 ? `1px solid ${borderColor}` : 'none' }}>
                  <button onClick={() => setAccordionOpen(i === 0 ? !accordionOpen : false)} style={{
                    width: '100%', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: 'none', backgroundColor: 'transparent', color: textColor, cursor: 'pointer',
                    fontSize: '14px', fontWeight: '500', fontFamily: designSystem.fontFamily, textAlign: 'left' as const,
                  }}>
                    {item.title}
                    <span style={{ color: mutedText, fontSize: '18px', transform: (i === 0 && accordionOpen) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>⌄</span>
                  </button>
                  {i === 0 && accordionOpen && item.content && (
                    <div style={{ padding: '0 16px 14px', fontSize: '13px', color: mutedText, lineHeight: 1.6 }}>{item.content}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Progress & Controls */}
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Progress & Controls</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: textColor, fontWeight: '500' }}>Progress</span>
                  <span style={{ fontSize: '13px', color: primary, fontWeight: '600' }}>{progressValue}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressValue}%`, backgroundColor: primary, borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: borderColor }} />
              {[
                { label: 'Dark mode', active: isDark },
                { label: 'Notifications', active: true },
              ].map(toggle => (
                <div key={toggle.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: textColor }}>{toggle.label}</span>
                  <div style={{ width: '44px', height: '24px', borderRadius: '12px', position: 'relative', backgroundColor: toggle.active ? primary : (isDark ? '#2A2A2A' : '#E5E5E5'), cursor: 'pointer' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '3px', left: toggle.active ? '23px' : '3px', transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 6. DATA DISPLAY */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Data Display</SectionTitle>
        <SectionSubtitle isDark={isDark}>Tables, badges, and alert components</SectionSubtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Table */}
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Data Table</CardLabel>
            <div style={{ overflow: 'hidden', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ backgroundColor: isDark ? '#0A0A0A' : '#F8F8F8' }}>
                    {['Name', 'Status', 'Role'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: '12px', fontWeight: '600', color: mutedText, borderBottom: `1px solid ${borderColor}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sarah Johnson', status: 'Active', role: 'Designer' },
                    { name: 'Marcus Chen', status: 'Away', role: 'Developer' },
                    { name: 'Emily Davis', status: 'Active', role: 'Manager' },
                    { name: 'Alex Kim', status: 'Inactive', role: 'Developer' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < 3 ? `1px solid ${borderColor}` : 'none' }}>
                      <td style={{ padding: '12px 14px', fontSize: '14px', color: textColor, fontWeight: '500' }}>{row.name}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                          backgroundColor: row.status === 'Active' ? '#d1fae5' : row.status === 'Away' ? '#fef3c7' : '#fee2e2',
                          color: row.status === 'Active' ? '#065f46' : row.status === 'Away' ? '#92400e' : '#991b1b',
                        }}>{row.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '14px', color: mutedText }}>{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Badges */}
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Badges / Status</CardLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {[
                { label: 'Default', bg: primary, color: '#fff', border: undefined },
                { label: 'Secondary', bg: isDark ? '#2A2A2A' : '#F5F5F5', color: textColor, border: undefined },
                { label: 'Success', bg: '#d1fae5', color: '#065f46', border: undefined },
                { label: 'Warning', bg: '#fef3c7', color: '#92400e', border: undefined },
                { label: 'Error', bg: '#fee2e2', color: '#991b1b', border: undefined },
                { label: 'Info', bg: '#dbeafe', color: '#1e40af', border: undefined },
                { label: 'Outline', bg: 'transparent', color: primary, border: `1px solid ${primary}` },
              ].map(b => (
                <span key={b.label} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: b.bg, color: b.color, border: b.border ?? 'none' }}>{b.label}</span>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'Primary', bg: adjustColorBrightness(primary, 0.95), border: adjustColorBrightness(primary, 0.8), color: primary, icon: 'ℹ' },
              { type: 'Success', bg: '#d1fae5', border: '#6ee7b7', color: '#065f46', icon: '✓' },
              { type: 'Warning', bg: '#fef3c7', border: '#fcd34d', color: '#92400e', icon: '⚠' },
              { type: 'Error', bg: '#fee2e2', border: '#fca5a5', color: '#991b1b', icon: '✕' },
            ].map(a => (
              <div key={a.type} style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: a.bg, border: `1px solid ${a.border}`, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: a.color, fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: a.color }}>{a.type} Alert</p>
                  <p style={{ margin: 0, fontSize: '13px', color: a.color, opacity: 0.8 }}>This is an example {a.type.toLowerCase()} message to show the alert style.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. NAVIGATION */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Navigation</SectionTitle>
        <SectionSubtitle isDark={isDark}>Breadcrumbs and pagination components</SectionSubtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Breadcrumbs</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              {['Home', 'Design System', 'Components'].map((crumb, i, arr) => (
                <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: i === arr.length - 1 ? textColor : primary, fontWeight: i === arr.length - 1 ? '600' : '400', cursor: i < arr.length - 1 ? 'pointer' : 'default' }}>{crumb}</span>
                  {i < arr.length - 1 && <span style={{ color: mutedText }}>/</span>}
                </span>
              ))}
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Pagination</CardLabel>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' as const }}>
              <button style={{ padding: '7px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, cursor: 'pointer', fontSize: '13px', fontFamily: designSystem.fontFamily }}>← Prev</button>
              {([1, 2, 3, '...', 8, 9, 10] as (number | string)[]).map((p, i) => (
                <button key={i} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: `1px solid ${p === 3 ? primary : borderColor}`,
                  backgroundColor: p === 3 ? primary : 'transparent',
                  color: p === 3 ? '#fff' : textColor,
                  cursor: 'pointer', fontSize: '13px', fontFamily: designSystem.fontFamily,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{p}</button>
              ))}
              <button style={{ padding: '7px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, cursor: 'pointer', fontSize: '13px', fontFamily: designSystem.fontFamily }}>Next →</button>
            </div>
          </Card>
        </div>
      </div>

      {/* 8. LOADING STATES */}
      <div style={sec}>
        <SectionTitle isDark={isDark}>Loading States</SectionTitle>
        <SectionSubtitle isDark={isDark}>Skeleton loading components</SectionSubtitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Card</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SkeletonBox isDark={isDark} w="100%" h="120px" r="8px" />
              <SkeletonBox isDark={isDark} w="70%" h="14px" r="6px" />
              <SkeletonBox isDark={isDark} w="50%" h="12px" r="6px" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <SkeletonBox isDark={isDark} w="80px" h="30px" r="8px" />
                <SkeletonBox isDark={isDark} w="60px" h="30px" r="8px" />
              </div>
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>List</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonBox isDark={isDark} w="40px" h="40px" r="50%" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <SkeletonBox isDark={isDark} w={`${80 - i * 10}%`} h="12px" r="6px" />
                    <SkeletonBox isDark={isDark} w={`${60 - i * 5}%`} h="10px" r="6px" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Table</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                {[1, 2, 3].map(i => <SkeletonBox key={i} isDark={isDark} w="100%" h="12px" r="6px" />)}
              </div>
              {[1, 2, 3, 4].map(r => (
                <div key={r} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                  {[1, 2, 3].map(c => <SkeletonBox key={c} isDark={isDark} w="100%" h="12px" r="6px" />)}
                </div>
              ))}
            </div>
          </Card>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Form</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonBox isDark={isDark} w="40%" h="10px" r="6px" />
                  <SkeletonBox isDark={isDark} w="100%" h="36px" r="8px" />
                </div>
              ))}
              <SkeletonBox isDark={isDark} w="100%" h="80px" r="8px" />
              <SkeletonBox isDark={isDark} w="30%" h="36px" r={btnRadius} />
            </div>
          </Card>
        </div>
      </div>

      {/* 9. FORM ELEMENTS */}
      <div style={{ ...sec, borderBottom: 'none' }}>
        <SectionTitle isDark={isDark}>Form Elements</SectionTitle>
        <SectionSubtitle isDark={isDark}>Input fields, checkboxes, radio buttons, and dropdowns</SectionSubtitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card isDark={isDark}>
            <CardLabel isDark={isDark}>Inputs</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Name', placeholder: undefined, defaultValue: 'Sarah Johnson' },
                { label: 'Email', placeholder: 'Enter your email', defaultValue: undefined },
              ].map(({ label, placeholder, defaultValue }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: textColor, marginBottom: '6px' }}>{label}</label>
                  <input defaultValue={defaultValue} placeholder={placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: textColor, marginBottom: '6px' }}>Message</label>
                <textarea placeholder="Type your message..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Checkboxes</CardLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(['opt1', 'opt2', 'opt3'] as const).map((key, i) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <div onClick={() => setCheckboxStates(prev => ({ ...prev, [key]: !prev[key] }))} style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      border: `2px solid ${checkboxStates[key] ? primary : borderColor}`,
                      backgroundColor: checkboxStates[key] ? primary : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      {checkboxStates[key] && <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '14px', color: textColor }}>Option {i + 1}</span>
                  </label>
                ))}
              </div>
            </Card>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Radio</CardLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['opt1', 'opt2', 'opt3'].map((val, i) => (
                  <label key={val} onClick={() => setRadioValue(val)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${radioValue === val ? primary : borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {radioValue === val && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primary }} />}
                    </div>
                    <span style={{ fontSize: '14px', color: textColor }}>Option {i + 1}</span>
                  </label>
                ))}
              </div>
            </Card>
            <Card isDark={isDark}>
              <CardLabel isDark={isDark}>Dropdown</CardLabel>
              <select style={inputStyle}>
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
