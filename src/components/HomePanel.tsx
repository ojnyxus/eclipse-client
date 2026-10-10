interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  tagColor: string;
}

const NEWS: NewsItem[] = [
  {
    title: 'Eclipse Client v1.0.0-beta Released',
    excerpt: 'The first public beta of Eclipse Client is now available. Featuring our new optimization engine, HUD configurator, and the obsidian interface.',
    date: 'Oct 8, 2026',
    tag: 'Release',
    tagColor: 'var(--neon-bright)',
  },
  {
    title: 'Fabric Mod Injection Now Live',
    excerpt: 'Sodium, Lithium, and FerriteCore are now automatically injected for Fabric instances. Adaptive JVM flags adjust based on your hardware profile.',
    date: 'Oct 5, 2026',
    tag: 'Update',
    tagColor: 'var(--success)',
  },
  {
    title: 'HUD Configurator: Export & Import',
    excerpt: 'Your HUD layout now serializes to a portable JSON config. Export your setup, share it with teammates, or carry it across machines.',
    date: 'Oct 2, 2026',
    tag: 'Feature',
    tagColor: 'var(--warning)',
  },
  {
    title: 'Community Spotlight: PvP Layouts',
    excerpt: 'Check out the top community-shared HUD layouts optimized for competitive PvP. CPS counter, keystrokes, and ping meter placements that matter.',
    date: 'Sep 28, 2026',
    tag: 'Community',
    tagColor: '#60a5fa',
  },
];

export default function HomePanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div
        className="glass"
        style={{
          padding: '40px 36px',
          borderRadius: 'var(--radius)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--neon-glow), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ fontSize: 11, letterSpacing: 4, color: 'var(--neon-bright)', fontWeight: 700, marginBottom: 10 }}>
          ENTER THE VOID
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          Dominate the Grid
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-dim)', maxWidth: 460, lineHeight: 1.6, marginBottom: 24 }}>
          A next-generation, obsidian-black Minecraft launcher engineered for competitive PvP,
          maximum FPS, and a UI that feels like piloting a starship.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="neon-btn">🚀 Launch Minecraft</button>
          <button className="ghost-btn">Optimize Instance</button>
        </div>
      </div>

      {/* News Feed */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 14, color: 'var(--text-dim)' }}>
          📡 NEWS STREAM
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {NEWS.map((item, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '18px 22px',
                borderRadius: 'var(--radius-sm)',
                transition: 'var(--transition)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.05)',
                    color: item.tagColor,
                    border: `1px solid ${item.tagColor}40`,
                  }}
                >
                  {item.tag}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{item.date}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{item.excerpt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
