import { useState } from 'react';

interface OverlayConfig {
  enabled: boolean;
  x: number;
  y: number;
}

const DEFAULT_OVERLAYS: Record<string, OverlayConfig & { label: string; render: () => string }> = {
  fps: {
    label: 'FPS Counter',
    enabled: true,
    x: 20,
    y: 20,
    render: () => 'FPS: 312',
  },
  ping: {
    label: 'Ping Meter',
    enabled: true,
    x: 20,
    y: 50,
    render: () => 'Ping: 14ms',
  },
  cps: {
    label: 'CPS Counter',
    enabled: true,
    x: 20,
    y: 80,
    render: () => 'CPS: 8.4',
  },
  keystrokes: {
    label: 'Keystrokes (WASD)',
    enabled: true,
    x: 180,
    y: 180,
    render: () => 'W A S D',
  },
  sprint: {
    label: 'Toggle Sprint',
    enabled: true,
    x: 180,
    y: 150,
    render: () => 'SPRINT: ON',
  },
  armor: {
    label: 'Armor Status',
    enabled: false,
    x: 180,
    y: 120,
    render: () => 'Armor: 87%',
  },
};

export default function HUDConfigurator() {
  const [overlays, setOverlays] = useState(DEFAULT_OVERLAYS);

  const toggle = (key: string) => {
    setOverlays((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%' }}>
      {/* Preview Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)' }}>
          🎮 LIVE HUD PREVIEW
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, #0a0b10, #0f1018)',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 400,
          }}
        >
          {/* Grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(138,43,226,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(138,43,226,0.04) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {Object.entries(overlays).map(([key, o]) =>
            o.enabled ? (
              <div
                key={key}
                style={{
                  position: 'absolute',
                  left: o.x,
                  top: o.y,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'rgba(6, 7, 10, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-bright)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--neon-bright)',
                  fontFamily: 'monospace',
                  textShadow: '0 0 8px var(--neon-glow)',
                  cursor: 'move',
                  userSelect: 'none',
                }}
              >
                {o.render()}
              </div>
            ) : null
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 14,
              fontSize: 10,
              color: 'var(--text-faint)',
            }}
          >
            1920 × 1080
          </div>
        </div>
      </div>

      {/* Overlay Toggles */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', marginBottom: 4 }}>
          OVERLAYS
        </div>
        {Object.entries(overlays).map(([key, o]) => (
          <div
            key={key}
            className="glass"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</span>
            <button
              onClick={() => toggle(key)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: o.enabled ? 'var(--neon)' : 'rgba(255,255,255,0.1)',
                position: 'relative',
                transition: 'var(--transition)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: o.enabled ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'var(--transition)',
                }}
              />
            </button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="neon-btn" style={{ flex: 1, fontSize: 12, padding: '9px 12px' }}>
            Export JSON
          </button>
          <button className="ghost-btn" style={{ flex: 1, fontSize: 12, padding: '9px 12px' }}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
