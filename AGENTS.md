# Eclipse Client — Base44 Setup

Two separate things live in this repo:

1. **Landing page** (repo root) — Vite + React + TypeScript, served by `docker-compose.base44.yml` on port 3000.
   This is what the preview shows. It has no backend and needs no secrets.
2. **The launcher** (`launcher/`) — a real Electron desktop app that signs in with Microsoft and launches Minecraft.
   It is **not** part of the web preview; it is built into `Eclipse-Client-Setup.exe`.

## Landing page
```
docker compose -f docker-compose.base44.yml up -d     # http://localhost:3000
```
`src/components/LandingPage.tsx` — the download button points at
`https://github.com/ojnyxus/eclipse-client/releases/latest/download/Eclipse-Client-Setup.exe`
(the `artifactName` in `launcher/package.json` must stay `Eclipse-Client-Setup.exe`).

## Launcher (`launcher/`)
- `main.js` / `preload.js` — Electron main process + IPC bridge (contextIsolation on, no node in renderer).
- `renderer/` — plain HTML/CSS/JS UI (no framework, no build step).
- `src/auth.js` — Microsoft sign-in via `msmc`. Only the refresh token is stored, encrypted with Electron `safeStorage`.
- `src/core/` — **Electron-free** logic, so it can be tested with plain Node:
  `java.js` (downloads Mojang's bundled JRE), `fabric.js`, `mods.js` (Sodium/Lithium/FerriteCore from Modrinth),
  `game.js` (drives `minecraft-launcher-core`), `versions.js`, `net.js`.
- Game files live in `<userData>/minecraft`; every Fabric version gets its own `instances/fabric-<version>` folder.

### Gotchas
- `game.js` patches MCLC's `Handler.prototype.checkJava`: MCLC probes Java with `java -version` and parses stderr,
  but we launch with `javaw.exe` on Windows (no console window) which prints nothing and would crash MCLC.
- Minecraft now uses year-style versions (e.g. `26.3`); they need newer Java runtimes — `java.js` reads the
  required component from each version's JSON, so this is handled.
- Launching needs internet (version manifests, Java runtime, mods) — there is no offline mode.
- Official Microsoft accounts only; there is deliberately no offline/cracked login.
- Not implemented (the README mentions them): in-game HUD overlays, skin manager, Forge/OptiFine, auto-update.

### Build the Windows installer
- CI: `.github/workflows/build-launcher.yml` (windows-latest). Run it manually, or push a tag like `v1.0.0-beta`
  to attach `Eclipse-Client-Setup.exe` to a GitHub Release.
- Locally on Windows: `cd launcher && npm ci && npm run dist` → `launcher/dist/Eclipse-Client-Setup.exe`.
- On Linux the NSIS step needs Wine (it runs the installer stub to create the uninstaller); use the
  `electronuserland/builder:wine` image.

### Testing without Windows / a display
Run the Electron-free core headless in Docker (use a throw-away offline session object in a `/tmp` script —
real launches use the Microsoft session). With `xvfb-run` + Mesa (`libgl1-mesa-dri`) and `ALSOFT_DRIVERS=null`,
the real game starts, loads Fabric + mods and reaches resource loading. The Electron UI can be smoke-tested the
same way with `xvfb-run electron <script> --no-sandbox --disable-gpu`.
The Microsoft login window itself cannot be tested without a real account.
