import { useState } from 'react';
import Starfield from './components/Starfield';
import Sidebar, { type ViewKey } from './components/Sidebar';
import HomePanel from './components/HomePanel';
import HUDConfigurator from './components/HUDConfigurator';
import ProfileManager from './components/ProfileManager';
import SettingsPanel from './components/SettingsPanel';

const TITLES: Record<ViewKey, string> = {
  home: 'Home',
  hud: 'HUD Configurator',
  profiles: 'Profile Manager',
  settings: 'Settings',
};

export default function App() {
  const [view, setView] = useState<ViewKey>('home');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
      <Starfield />

      {/* Window chrome */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 38,
            minHeight: 38,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: '1px solid var(--border)',
            background: 'rgba(6, 7, 10, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', letterSpacing: 2 }}>
            ECLIPSE CLIENT
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Sidebar active={view} onNavigate={setView} />

          {/* Main content */}
          <main
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '28px 32px',
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{TITLES[view]}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
                {view === 'home' && 'Launcher announcements, patch notes, and community highlights'}
                {view === 'hud' && 'Drag-repositionable overlays, individually toggleable and themeable'}
                {view === 'profiles' && 'Manage your Minecraft identities and instance configurations'}
                {view === 'settings' && 'RAM allocation, JVM flags, and mod injection'}
              </div>
            </div>

            {view === 'home' && <HomePanel />}
            {view === 'hud' && <HUDConfigurator />}
            {view === 'profiles' && <ProfileManager />}
            {view === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    </div>
  );
}
