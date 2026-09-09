<div align="center">

<img src="https://github.com/ojnyxus/eclipse-client/raw/main/hero-eclipse.jpg" alt="Eclipse Client Banner" width="100%" />

# 🌑 ECLIPSE CLIENT

### *Enter the Void. Dominate the Grid.*

**A next-generation, obsidian-black Minecraft launcher engineered for competitive PvP, maximum FPS, and a UI that feels like piloting a starship.**

[![Version](https://img.shields.io/badge/version-1.0.0--beta-8A2BE2?style=for-the-badge&labelColor=06070a)](https://github.com/ojnyxus/eclipse-client/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-8A2BE2?style=for-the-badge&labelColor=06070a)](https://eclipseclient.lovable.app/)
[![Website](https://img.shields.io/badge/website-online-8A2BE2?style=for-the-badge&labelColor=06070a)](https://eclipseclient.lovable.app/)
[![License](https://img.shields.io/badge/license-MIT-8A2BE2?style=for-the-badge&labelColor=06070a)](#-license--legal-disclaimer)

<br/>

[**🌐 Website**](https://eclipseclient.lovable.app/) &nbsp;•&nbsp; [**⬇️ Download**](https://github.com/ojnyxus/eclipse-client/releases) &nbsp;•&nbsp; [**💬 Discord**](https://discord.gg/) &nbsp;•&nbsp; [**🐛 Issues**](https://github.com/ojnyxus/eclipse-client/issues)

</div>

---

## 📖 Executive Overview

Minecraft's third-party launcher ecosystem has barely evolved in a decade. Most tools in circulation today are still built on aging Electron/Swing shells stitched together years ago — heavy on RAM at idle, slow to boot, and visually stuck in 2015. For a competitive PvP player, that overhead isn't cosmetic — it's frame time you don't get back, input lag you can't optimize away, and a UI that gets in the way of getting into a game.

**Eclipse Client** was built to answer a simple question: *what would a Minecraft launcher look like if it were designed in 2026, by people who actually care about frame pacing, memory pressure, and interface latency?*

The result is a **frameless, GPU-accelerated desktop application** with three founding priorities:

1. **Performance first.** Every default — from JVM flags to bundled optimization mods — is tuned for the lowest possible frame time and the smallest possible memory footprint, so the launcher itself never competes with the game for resources.
2. **Configuration without friction.** HUD elements, RAM allocation, and mod injection are all exposed through a real-time visual interface instead of buried in text config files.
3. **An interface worth looking at.** Glassmorphism panels, a live starfield backdrop, and a cohesive neon-violet-on-obsidian palette replace the flat, utilitarian look of legacy launchers.

Eclipse Client doesn't try to be a mod manager, a server host, or a social network. It does one thing — get you into an optimized Minecraft session as fast and cleanly as possible — and does it with obsessive attention to both performance and polish.

---

## ✨ Core Feature Breakdown

### 🚀 100,000 FPS Optimization Engine

The centerpiece of Eclipse Client. On first launch, the engine profiles your system and automatically assembles a performance-optimized instance:

- **Automated mod injection**, tailored to your chosen mod loader:
  - **Fabric:** [Sodium](https://modrinth.com/mod/sodium) (rendering engine rewrite), [Lithium](https://modrinth.com/mod/lithium) (general-purpose game logic optimization), and [FerriteCore](https://modrinth.com/mod/ferrite-core) (memory usage reduction).
  - **Forge:** [OptiFine](https://optifine.net/) for rendering optimization and **Patcher** for input/render-thread tuning.
- **Pre-tuned JVM flags**, applied automatically at launch — no manual `java -jar` incantations required:
  ```bash
  -XX:+UseG1GC
  -XX:+ParallelRefProcEnabled
  -XX:MaxGCPauseMillis=200
  -XX:+UnlockExperimentalVMOptions
  -XX:+DisableExplicitGC
  -XX:G1NewSizePercent=30
  -XX:G1MaxNewSizePercent=40
  -XX:G1HeapRegionSize=8M
  -XX:G1ReservePercent=20
  -XX:InitiatingHeapOccupancyPercent=15
  ```
- **Adaptive tuning:** flags and mod selections are adjusted based on detected CPU core count, available system RAM, and GPU vendor, rather than applied as a single one-size-fits-all preset.
- **One-click revert:** every optimization pass is reversible, restoring vanilla launch parameters instantly.

> The "100,000 FPS" framing is aspirational branding for the engine's ceiling-removal philosophy (uncapped frame rendering, minimal main-thread blocking) — actual FPS is naturally bound by your hardware, resolution, and world complexity.

### 🎮 Advanced In-Game HUD Configurator

A real-time overlay system for players who live and die by information density:

| Overlay | Description |
|---|---|
| **FPS Counter** | Live frame rate with min/avg/max tracking and a lightweight graph mode |
| **Ping Meter** | Real-time latency to the connected server, color-coded by threshold |
| **CPS Counter** | Clicks-per-second tracker, per mouse button, with a rolling average |
| **Keystrokes (WASD)** | Visual key-press indicator for movement + spacebar, styled to match the obsidian theme |
| **Toggle Sprint** | On-screen sprint-state indicator with one-key toggle binding |
| **Armor Status** | Live durability and enchantment summary for equipped armor |

Every overlay is drag-repositionable on a live preview canvas, individually toggleable, and themeable (color, opacity, scale). The entire configuration serializes to a portable **JSON config**, exportable and importable in one click — ideal for players who set up a layout once and want to carry it across machines or share it with teammates.

```json
{
  "hud": {
    "fps": { "enabled": true, "position": [12, 12], "graphMode": false },
    "ping": { "enabled": true, "position": [12, 40], "warnThreshold": 120 },
    "cps": { "enabled": true, "position": [12, 68], "trackBothButtons": true },
    "keystrokes": { "enabled": true, "position": [1780, 900], "style": "outline" },
    "toggleSprint": { "enabled": true, "position": [1780, 860] },
    "armorStatus": { "enabled": false, "position": [1780, 780] }
  }
}
```

### 🧑‍🚀 Local Profile & Skin Manager

Eclipse Client includes a streamlined profile system for managing your Minecraft identity within the launcher:

- **Multiple profile slots**, so you can switch between accounts or configurations without re-entering credentials each time.
- **Custom skin preview and application**, rendered live in the 3D player viewport before you launch.
- **Profile-specific settings**, letting each profile retain its own HUD layout, RAM allocation, and mod selection.

Eclipse Client authenticates through the official Microsoft/Mojang sign-in flow, the same as any standard launcher — this manager is strictly about making *your own, already-owned* accounts faster to organize and switch between, not a substitute for ownership or authentication.

### 🌌 Cosmic Obsidian Interface

The visual identity that gives Eclipse Client its name:

- **Frameless, glassmorphic window** — translucent, blurred panels (`backdrop-filter: blur()`) floating over a pure obsidian base (`#06070a`).
- **Interactive HTML5 Canvas starfield**, rendering hundreds of parallax-scrolling particles that subtly react to cursor movement, giving the background genuine depth instead of a static image.
- **Neon violet accent system** used consistently across buttons, active states, progress bars, and hover glows — never scattered across unrelated hues.
- **Dynamic news stream panel**, pulling launcher announcements, patch notes, and community highlights into a live-updating card feed on the home screen.
- **RAM allocation slider** with real-time system memory awareness — the slider visually warns you before you allocate more RAM than is safely available.
- **Micro-interactions everywhere**: buttons ripple, panels ease in with cubic-bezier transitions, and the sidebar collapses with a physically-plausible spring animation.

---

## 🖥️ Interface Blueprint

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ●  ●  ●                         ECLIPSE CLIENT                    ─ □ ✕ │
├───────────┬────────────────────────────────────────────────────────────┤
│           │                                                            │
│   [◆]     │     ✦  ·   ·      ·        ·    ·   ·  ✦    ·       ·      │
│  HOME     │        ·     ·   ·    ·  ·    ·      ·    ·    ·   ·       │
│           │   ·  ·    ┌──────────────────────────────┐   ·    ·   ·    │
│   [▣]     │  ·     ·  │      Welcome back, Player     │  ·   ·     ·   │
│  PROFILES │     ·     │   ───────────────────────     │     ·   ·      │
│           │  ·   ·    │   Fabric 1.21.4  •  Sodium ✓  │  ·      ·   ·  │
│   [⚙]     │     ·   · │   Lithium ✓  •  FerriteCore ✓ │    ·  ·    ·   │
│  HUD      │  ·     ·  └──────────────────────────────┘  ·    ·     ·   │
│           │     ·                                           ·   ·      │
│   [▤]     │  ·      ┌────────────┐   ┌──────────────────┐    ·    ·   │
│  MODS     │     ·   │  RAM: 6GB  │   │  ▶  L A U N C H   │  ·      ·   │
│           │  ·   ·  │ ▓▓▓▓▓▓░░░░ │   └──────────────────┘     ·   ·    │
│   [☰]     │     ·   └────────────┘                          ·    ·    │
│  NEWS     │  ·          ·      ·    ·       ·    ·      ·  ·    ·   ·  │
│           │                                                            │
│   [●]     ├────────────────────────────────────────────────────────────┤
│  SETTINGS │  Eclipse News:  "1.0.0-beta patch notes are live" →        │
└───────────┴────────────────────────────────────────────────────────────┘
```

*Frameless custom titlebar · collapsible icon sidebar · glassmorphic center panel floating over the animated starfield canvas.*

---

## 🏗️ Technical Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Application Shell** | Electron v30+ | Cross-platform native window, frameless chrome, OS-level integration |
| **UI Framework** | React 18 | Component-driven rendering for all launcher views |
| **Language** | TypeScript | Type-safe application logic across main and renderer processes |
| **Styling** | Tailwind CSS v3 | Utility-first styling powering the glassmorphism/obsidian design system |
| **Process Orchestration** | Node.js `child_process` | Spawning and managing the Java game process, JVM flag injection, log piping |
| **Starfield Rendering** | HTML5 Canvas API | GPU-friendly particle animation for the interactive background |
| **State Management** | React Context + hooks | Profile, HUD config, and settings state across the renderer |
| **Config Persistence** | Local JSON storage | HUD layouts, profiles, and settings serialization |

**Process model:** the Electron **main process** owns window lifecycle, filesystem access, and Java process spawning; the **renderer process** (React) owns all UI, communicating over a strictly-typed IPC bridge — no direct filesystem or child-process access from renderer code, keeping the attack surface minimal.

---

## 🗺️ Development Roadmap

- [x] **Phase 1 — Concept & Design System**
  - [x] Define Space Obsidian visual identity and neon-violet palette
  - [x] Prototype glassmorphism component library
  - [x] Build interactive starfield canvas proof-of-concept

- [x] **Phase 2 — Core Launcher Functionality**
  - [x] Electron shell with frameless window + custom titlebar
  - [x] Java runtime detection and version management
  - [x] Basic launch pipeline (vanilla + Fabric)

- [x] **Phase 3 — Optimization Engine**
  - [x] Automated Sodium / Lithium / FerriteCore injection (Fabric)
  - [x] OptiFine / Patcher injection (Forge)
  - [x] Pre-tuned JVM flag profiles with adaptive tuning

- [ ] **Phase 4 — HUD & Customization Suite** *(in progress)*
  - [x] FPS / Ping / CPS overlays
  - [x] Keystrokes + Toggle Sprint overlays
  - [ ] Armor Status overlay polish
  - [ ] JSON HUD config export/import UI

- [ ] **Phase 5 — Stability, Distribution & Auto-Update**
  - [ ] Crash reporting + telemetry opt-in
  - [ ] Code-signed builds for Windows/macOS
  - [ ] Auto-updater (electron-updater) with delta patches
  - [ ] Public 1.0.0 stable release

---

## ⚡ Quick Start & Developer Guide

### Prerequisites

- **Node.js** `v18.x` or higher
- **npm** `v9.x` or higher (bundled with Node.js)
- **JDK** `17+` (required to run Minecraft itself; the launcher will detect existing installations or prompt to install one)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ojnyxus/eclipse-client.git
cd eclipse-client

# 2. Install dependencies
npm install

# 3. Run in development mode (hot-reload enabled)
npm run dev

# 4. Build a production-ready installer for your platform
npm run build
```

### Useful Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches Eclipse Client in development mode with hot-reload |
| `npm run build` | Compiles and packages a distributable installer (Windows `.exe`, macOS `.dmg`, Linux `.AppImage`) |
| `npm run lint` | Runs ESLint across the codebase |
| `npm run typecheck` | Runs the TypeScript compiler in `--noEmit` check mode |

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>Is Eclipse Client free to use?</strong></summary>
<br>
Yes. Eclipse Client is fully open-source under the MIT License and free to download, use, and modify. There are no premium tiers, paywalls, or subscription requirements.
</details>

<details>
<summary><strong>Does Eclipse Client support cracked or unauthorized accounts?</strong></summary>
<br>
No. Eclipse Client authenticates through the standard Microsoft/Mojang sign-in flow and requires a valid, purchased copy of Minecraft, the same as any other third-party launcher. The Local Profile Manager only organizes and switches between accounts you already own — it does not bypass or replace authentication.
</details>

<details>
<summary><strong>Which operating systems are supported?</strong></summary>
<br>
Eclipse Client ships native builds for <strong>Windows 10/11</strong>, <strong>macOS 12+</strong> (both Intel and Apple Silicon via a universal binary), and major <strong>Linux</strong> distributions through an AppImage build. All three platforms receive feature parity — there is no "lite" version.
</details>

<details>
<summary><strong>How does HUD config export/import work?</strong></summary>
<br>
Every HUD overlay's position, scale, color, and enabled/disabled state is stored in a single structured JSON object. Clicking "Export" in the HUD Configurator serializes the current layout to a <code>.json</code> file on disk; "Import" reads a compatible file back in and instantly re-applies every overlay's saved position and styling. This makes it easy to back up a layout, move it between machines, or share a preset with teammates.
</details>

<details>
<summary><strong>Will the optimization engine work with mods I already have installed?</strong></summary>
<br>
Yes. The optimization engine checks your existing mod folder before injecting anything, skips mods that are already present or conflict with the automated selection, and never overwrites a manually-installed mod without confirmation.
</details>

<details>
<summary><strong>Can I disable the automated JVM flags and set my own?</strong></summary>
<br>
Yes. The Settings panel includes an "Advanced" section where automated JVM flag injection can be turned off entirely in favor of a custom flag string, for players who want full manual control.
</details>

---

## ⚖️ License & Legal Disclaimer

**Eclipse Client** is released under the **MIT License**. You are free to use, modify, and distribute this software in accordance with the license terms. See [`LICENSE`](./LICENSE) for the full text.

```
MIT License

Copyright (c) 2026 Eclipse Client Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**Disclaimer:** Eclipse Client is an independent, community-developed project and is **not affiliated with, endorsed by, or sponsored by Mojang Studios, Microsoft Corporation, or the official Minecraft brand** in any way. "Minecraft" is a trademark of Mojang Synergies AB / Microsoft. Eclipse Client requires a legitimately owned copy of Minecraft to function and does not distribute, host, or provide access to the game itself.

<div align="center">

<br>

**Built for players who take their frames seriously.**

[⬆ Back to top](#-eclipse-client)

</div>
