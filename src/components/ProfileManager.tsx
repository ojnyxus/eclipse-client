import { useState } from 'react';

interface Profile {
  id: number;
  name: string;
  version: string;
  loader: string;
  ram: string;
  active: boolean;
}

const INITIAL_PROFILES: Profile[] = [
  { id: 1, name: 'Competitive', version: '1.20.4', loader: 'Fabric', ram: '4 GB', active: true },
  { id: 2, name: 'Casual Build', version: '1.21.1', loader: 'Fabric', ram: '6 GB', active: false },
  { id: 3, name: 'Speedrun', version: '1.16.5', loader: 'Forge', ram: '3 GB', active: false },
];

export default function ProfileManager() {
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);

  const setActive = (id: number) => {
    setProfiles((prev) => prev.map((p) => ({ ...p, active: p.id === id })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Active Profile Card */}
      <div
        className="glass"
        style={{
          padding: '28px 32px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--neon), var(--obsidian-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            flexShrink: 0,
            boxShadow: '0 0 20px var(--neon-glow)',
          }}
        >
          🧑‍🚀
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--neon-bright)', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
            ACTIVE PROFILE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            {profiles.find((p) => p.active)?.name}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-dim)' }}>
            <span>📦 MC {profiles.find((p) => p.active)?.version}</span>
            <span>🔧 {profiles.find((p) => p.active)?.loader}</span>
            <span>💾 {profiles.find((p) => p.active)?.ram} RAM</span>
          </div>
        </div>
        <button className="neon-btn">Launch</button>
      </div>

      {/* Profile Slots */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)' }}>
            🧑‍🚀 PROFILE SLOTS
          </div>
          <button className="ghost-btn" style={{ fontSize: 12, padding: '7px 16px' }}>
            + New Profile
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.map((p) => (
            <div
              key={p.id}
              className="glass"
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                border: p.active ? '1px solid var(--border-bright)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onClick={() => setActive(p.id)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: p.active ? 'var(--neon-dim)' : 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  border: p.active ? '1px solid var(--border-bright)' : '1px solid transparent',
                }}
              >
                🎮
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                  MC {p.version} · {p.loader} · {p.ram}
                </div>
              </div>
              {p.active && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 4,
                    background: 'var(--neon-dim)',
                    color: 'var(--neon-bright)',
                    border: '1px solid var(--border-bright)',
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
