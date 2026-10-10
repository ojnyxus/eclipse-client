import { useState } from 'react';

const JVM_FLAGS = [
  '-XX:+UseG1GC',
  '-XX:+ParallelRefProcEnabled',
  '-XX:MaxGCPauseMillis=200',
  '-XX:+UnlockExperimentalVMOptions',
  '-XX:+DisableExplicitGC',
  '-XX:G1NewSizePercent=30',
  '-XX:G1MaxNewSizePercent=40',
  '-XX:G1HeapRegionSize=8M',
  '-XX:G1ReservePercent=20',
  '-XX:InitiatingHeapOccupancyPercent=15',
];

export default function SettingsPanel() {
  const [ram, setRam] = useState(4);
  const maxRam = 16;
  const safeLimit = Math.floor(maxRam * 0.75);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* RAM Allocation */}
      <div className="glass" style={{ padding: '24px 28px', borderRadius: 'var(--radius)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', marginBottom: 18 }}>
          💾 RAM ALLOCATION
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: ram > safeLimit ? 'var(--warning)' : 'var(--neon-bright)' }}>
            {ram}
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>GB / {maxRam} GB detected</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxRam}
          value={ram}
          onChange={(e) => setRam(Number(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            appearance: 'none',
            borderRadius: 3,
            background: `linear-gradient(to right, var(--neon) ${((ram / maxRam) * 100)}%, rgba(255,255,255,0.08) ${((ram / maxRam) * 100)}%)`,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-faint)' }}>
          <span>1 GB</span>
          <span style={{ color: ram > safeLimit ? 'var(--warning)' : 'var(--text-faint)' }}>
            Safe limit: {safeLimit} GB {ram > safeLimit && '⚠'}
          </span>
          <span>{maxRam} GB</span>
        </div>
        {ram > safeLimit && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', fontSize: 12, color: 'var(--warning)' }}>
            ⚠ Allocating more than {safeLimit} GB may impact system stability. Eclipse recommends staying within the safe limit.
          </div>
        )}
      </div>

      {/* JVM Flags */}
      <div className="glass" style={{ padding: '24px 28px', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)' }}>
            ⚡ PRE-TUNED JVM FLAGS
          </div>
          <span style={{ fontSize: 11, color: 'var(--success)' }}>● Auto-applied at launch</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {JVM_FLAGS.map((flag, i) => (
            <code
              key={i}
              style={{
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                padding: '5px 10px',
                borderRadius: 6,
                background: 'rgba(138,43,226,0.06)',
                border: '1px solid var(--border)',
                color: 'var(--neon-bright)',
              }}
            >
              {flag}
            </code>
          ))}
        </div>
      </div>

      {/* Mod Injection */}
      <div className="glass" style={{ padding: '24px 28px', borderRadius: 'var(--radius)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', marginBottom: 16 }}>
          📦 MOD INJECTION
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, padding: '16px', borderRadius: 10, background: 'rgba(138,43,226,0.06)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Fabric</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-dim)' }}>
              <span>✅ Sodium</span>
              <span>✅ Lithium</span>
              <span>✅ FerriteCore</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px', borderRadius: 10, background: 'rgba(138,43,226,0.06)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Forge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-dim)' }}>
              <span>✅ OptiFine</span>
              <span>✅ Patcher</span>
              <span style={{ color: 'var(--text-faint)' }}>Render-thread tuning</span>
            </div>
          </div>
        </div>
        <button className="ghost-btn" style={{ marginTop: 16, fontSize: 12, padding: '9px 18px' }}>
          ↺ Revert to Vanilla
        </button>
      </div>
    </div>
  );
}
