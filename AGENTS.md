# Eclipse Client — Base44 Setup

## What this is
A web-based recreation of the "Eclipse Client" Minecraft launcher UI described in the repo's README.
Built from scratch with Vite + React + TypeScript (no pre-existing app code in the repo).

## Stack
- Vite 6 + React 18 + TypeScript
- Plain CSS (obsidian/neon-violet theme, no CSS framework)
- No backend, no database, no external credentials

## Run
```
docker compose -f docker-compose.base44.yml up -d
```
App is served on host port 3000 (mapped to container 5173).

## Structure
- `src/App.tsx` — shell: title bar + sidebar + routed panels
- `src/components/Starfield.tsx` — canvas particle background
- `src/components/Sidebar.tsx` — navigation
- `src/components/HomePanel.tsx` — hero + news feed
- `src/components/HUDConfigurator.tsx` — overlay toggles + live preview
- `src/components/ProfileManager.tsx` — profile slots
- `src/components/SettingsPanel.tsx` — RAM slider + JVM flags + mod injection

## Notes
- The compose uses `node:22-slim`, bind-mounts the source, and runs `npm install && npm run dev` so edits hot-reload without rebuilds.
- No secrets required — the app is fully client-side.
