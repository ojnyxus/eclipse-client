interface Feature {
  icon: string;
  title: string;
  description: string;
  details: string[];
  soon?: boolean;
}

const DOWNLOAD_URL =
  'https://github.com/ojnyxus/eclipse-client/releases/latest/download/Eclipse-Client-Setup.exe';
const RELEASES_URL = 'https://github.com/ojnyxus/eclipse-client/releases';

const FEATURES: Feature[] = [
  {
    icon: '🚀',
    title: 'Performance Engine',
    description: 'Pick a version and press Play. Eclipse prepares an optimized Fabric instance for you.',
    details: [
      'Sodium, Lithium and FerriteCore installed from Modrinth',
      'Pre-tuned G1GC JVM flags',
      'Separate Fabric instance per version, so mods never clash',
      'Switch to Vanilla any time',
    ],
  },
  {
    icon: '🔐',
    title: 'Official Microsoft Sign-in',
    description: 'You sign in on Microsoft\'s own page. Eclipse never sees or stores your password.',
    details: [
      'Only a refresh token is kept, encrypted by Windows',
      'Needs a Minecraft: Java Edition account',
      'Java runtime downloaded automatically, nothing to install',
      'RAM slider that warns before you over-allocate',
    ],
  },
  {
    icon: '🌌',
    title: 'Cosmic Obsidian Interface',
    description: 'Glassmorphism panels floating over a pure obsidian base with a live interactive starfield.',
    details: [
      'Frameless glassmorphic window',
      'Canvas parallax starfield',
      'Neon-violet accent system',
      'Live console with the game log',
    ],
  },
  {
    icon: '🎮',
    title: 'HUD Configurator',
    description: 'Drag-and-drop overlays for FPS, ping, CPS and keystrokes.',
    details: [
      'FPS, Ping, CPS counters',
      'Keystrokes (WASD) + Toggle Sprint',
      'JSON export / import',
      'Needs an in-game mod, so it is not part of this release',
    ],
    soon: true,
  },
];

const STATS = [
  { value: '3', label: 'Optimization mods' },
  { value: 'Auto', label: 'Java runtime' },
  { value: 'Official', label: 'Microsoft sign-in' },
  { value: '0', label: 'Telemetry' },
];

export default function LandingPage() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 48px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(6, 7, 10, 0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--neon-bright), var(--obsidian))',
              boxShadow: '0 0 14px var(--neon-glow)',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>ECLIPSE</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="#features" style={navLinkStyle}>Features</a>
          <a href="#download" style={navLinkStyle}>Download</a>
          <a href="https://github.com/ojnyxus/eclipse-client" target="_blank" rel="noopener" style={navLinkStyle}>GitHub</a>
          <a href="https://discord.gg/" target="_blank" rel="noopener" style={navLinkStyle}>Discord</a>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 48px 60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 400,
            background: 'radial-gradient(ellipse, var(--neon-glow), transparent 65%)',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <div style={{ fontSize: 12, letterSpacing: 6, color: 'var(--neon-bright)', fontWeight: 700, marginBottom: 20, position: 'relative' }}>
          ENTER THE VOID · DOMINATE THE GRID
        </div>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 760,
            position: 'relative',
          }}
        >
          The Minecraft launcher that{' '}
          <span className="neon-text">feels like piloting a starship</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            color: 'var(--text-dim)',
            maxWidth: 580,
            lineHeight: 1.7,
            marginBottom: 36,
            position: 'relative',
          }}
        >
          A next-generation, obsidian-black launcher engineered for competitive PvP,
          maximum FPS, and an interface obsessed with frame pacing and input latency.
        </p>
        <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
          <a
            href={DOWNLOAD_URL}
            className="neon-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', fontSize: 15 }}
          >
            ⬇ Download for Free
          </a>
          <a
            href="#features"
            className="ghost-btn"
            style={{ textDecoration: 'none', padding: '14px 28px', fontSize: 15 }}
          >
            Explore Features
          </a>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, position: 'relative' }}>
          <span style={badgeStyle}>Windows 10 / 11</span>
          <span style={badgeStyle}>64-bit</span>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 64,
          padding: '32px 48px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(6, 7, 10, 0.4)',
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--neon-bright)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '70px 48px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: 'var(--neon-bright)', fontWeight: 700, marginBottom: 12 }}>
            FEATURES
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Built for the competitive edge</h2>
          <p style={{ fontSize: 15, color: 'var(--text-dim)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Every default is tuned for the lowest possible frame time and the smallest memory footprint.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '28px 30px',
                borderRadius: 'var(--radius)',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                {f.title}
                {f.soon && (
                  <span style={{ ...badgeStyle, marginLeft: 10, verticalAlign: 'middle', color: 'var(--warning)' }}>
                    Coming soon
                  </span>
                )}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 16 }}>{f.description}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {f.details.map((d, j) => (
                  <li key={j} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--neon-bright)', fontSize: 14 }}>▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <section
        id="download"
        style={{
          padding: '80px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 300,
            background: 'radial-gradient(ellipse, var(--neon-glow), transparent 70%)',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, position: 'relative' }}>
          Ready to enter the void?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-dim)', maxWidth: 460, lineHeight: 1.6, marginBottom: 36, position: 'relative' }}>
          Download Eclipse Client for free. Sign in with your Minecraft account and press Play.
          No telemetry, no bloat.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', position: 'relative' }}>
          <a
            href={DOWNLOAD_URL}
            className="neon-btn"
            style={{ textDecoration: 'none', padding: '16px 48px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            ⬇ Download Eclipse-Client-Setup.exe
          </a>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            v1.0.0-beta · Windows 10 / 11 · 64-bit ·{' '}
            <a href={RELEASES_URL} target="_blank" rel="noopener" style={{ color: 'var(--neon-bright)' }}>
              all releases
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 40, position: 'relative' }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>✓ Open Source (MIT)</span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>✓ No telemetry</span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>✓ Official Microsoft sign-in</span>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 48px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(6, 7, 10, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--neon-bright), var(--obsidian))',
              boxShadow: '0 0 10px var(--neon-glow)',
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Eclipse Client · MIT License</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/ojnyxus/eclipse-client" target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--text-faint)' }}>GitHub</a>
          <a href="https://discord.gg/" target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--text-faint)' }}>Discord</a>
          <a href="https://eclipseclient.lovable.app/" target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--text-faint)' }}>Website</a>
        </div>
      </footer>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-dim)',
  textDecoration: 'none',
  transition: 'var(--transition)',
  fontWeight: 500,
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-faint)',
  padding: '4px 12px',
  borderRadius: 20,
  border: '1px solid var(--border)',
  background: 'rgba(138,43,226,0.04)',
};
