export type ViewKey = 'home' | 'hud' | 'profiles' | 'settings';

interface SidebarProps {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

const NAV_ITEMS: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🌑' },
  { key: 'hud', label: 'HUD Configurator', icon: '🎮' },
  { key: 'profiles', label: 'Profiles', icon: '🧑‍🚀' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside
      className="glass"
      style={{
        width: 240,
        minWidth: 240,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        gap: 6,
        borderRadius: 0,
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px 20px',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--neon-bright), var(--obsidian))',
            boxShadow: '0 0 16px var(--neon-glow)',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1 }}>
            ECLIPSE
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', letterSpacing: 2 }}>
            CLIENT v1.0.0-beta
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? 'var(--text)' : 'var(--text-dim)',
                background: isActive ? 'var(--neon-dim)' : 'transparent',
                border: isActive ? '1px solid var(--border-bright)' : '1px solid transparent',
                transition: 'var(--transition)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Status */}
      <div
        className="glass"
        style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--success)',
            boxShadow: '0 0 8px var(--success)',
            animation: 'pulse 2s infinite',
          }}
        />
        <div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>Online</div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Session active</div>
        </div>
      </div>
    </aside>
  );
}
