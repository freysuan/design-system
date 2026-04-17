import { useState, useEffect } from "react";
import { Moon, Sun, Save } from "lucide-react";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterCanvas } from "@/components/CenterCanvas";
import { ExportModal } from "@/components/ExportModal";
import type { DesignSystem } from "@/types";

const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  projectName: 'My Design System',
  primaryColor: '#8d1ff4',
  secondaryColor: '#a855f7',
  neutralColor: '#666666',
  successColor: '#10B981',
  warningColor: '#F59E0B',
  errorColor: '#EF4444',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  headingFont: 'Plus Jakarta Sans, sans-serif',
  baseFontSize: 16,
  typeScaleRatio: 1.25,
  baseSpacing: 8,
  borderRadius: 12,
  elevation: 'soft',
};

export default function App() {
  const [designSystem, setDesignSystem] = useState<DesignSystem>(DEFAULT_DESIGN_SYSTEM);
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('light');
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (appTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [appTheme]);

  const handleSave = () => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const toggleTheme = () => {
    setAppTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={appTheme === 'dark' ? 'dark' : ''}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cube logo */}
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #8d1ff4 0%, #a855f7 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9" />
              <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="white" fillOpacity="0.5" />
              <path d="M12 12V22L22 17V7L12 12Z" fill="white" fillOpacity="0.7" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>
              Design System Generator
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>
              Create professional design tokens from your brand colors
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
            }}
          >
            {appTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: saveFlash ? '#7c3aed' : 'var(--primary)',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'var(--font-sans)',
              transition: 'background-color 0.2s',
            }}
          >
            <Save size={15} />
            {saveFlash ? 'Saved!' : 'Save'}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{
          width: '320px',
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--background)',
        }}>
          <LeftPanel
            designSystem={designSystem}
            setDesignSystem={setDesignSystem}
            onExport={() => setShowExportModal(true)}
          />
        </aside>

        <main style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--muted)' }}>
          <CenterCanvas designSystem={designSystem} previewMode={appTheme} />
        </main>
      </div>

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          designSystem={designSystem}
        />
      )}
    </div>
  );
}
