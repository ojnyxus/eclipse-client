'use strict';
const fs = require('fs');
const path = require('path');
const { Client } = require('minecraft-launcher-core');
const Handler = require('minecraft-launcher-core/components/handler');
const { ensureJava } = require('./java');
const { ensureFabric } = require('./fabric');
const { ensureOptimizationMods } = require('./mods');

// Pre-tuned JVM flags from the README.
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

// MCLC probes Java with `java -version` and parses stderr. javaw.exe (the windowless Java
// we want to launch with on Windows) prints nothing, which would crash that probe.
// Probe the sibling java.exe instead; the game itself still starts with javaw.exe.
const originalCheckJava = Handler.prototype.checkJava;
Handler.prototype.checkJava = function checkJava(java) {
  return originalCheckJava.call(this, java.replace(/javaw\.exe$/i, 'java.exe'));
};

/**
 * Prepares everything Minecraft needs (Java, Fabric, mods, game files) and starts it.
 *
 * @param {object} o
 * @param {string} o.root           Launcher game directory.
 * @param {object} o.authorization  MCLC auth object (from msmc `mclc()`).
 * @param {string} o.mcVersion      Minecraft release id, e.g. "1.20.4".
 * @param {'fabric'|'vanilla'} o.loader
 * @param {number} o.ramMb
 * @param {boolean} o.useJvmFlags
 * @param {boolean} o.optimize      Install Sodium/Lithium/FerriteCore (Fabric only).
 * @param {(type: string, payload: object) => void} o.emit
 * @returns {Promise<{ stop: () => void, closed: Promise<number> }>}
 */
async function launchGame({ root, authorization, mcVersion, loader, ramMb, useJvmFlags, optimize, emit }) {
  const log = (line) => emit('log', { line });

  emit('status', { state: 'preparing', message: 'Checking Java runtime…' });
  const javaPath = await ensureJava({
    root,
    mcVersion,
    onProgress: ({ current, total }) => emit('progress', { label: 'Downloading Java runtime', current, total }),
  });

  let custom;
  let gameDir = root;
  if (loader === 'fabric') {
    emit('status', { state: 'preparing', message: 'Installing Fabric…' });
    custom = await ensureFabric({ root, mcVersion });
    // Mods are version specific, so every Fabric version gets its own instance folder.
    gameDir = path.join(root, 'instances', `fabric-${mcVersion}`);
    fs.mkdirSync(gameDir, { recursive: true });
    if (optimize) {
      emit('status', { state: 'preparing', message: 'Updating optimization mods…' });
      await ensureOptimizationMods({ gameDir, mcVersion, log });
    }
  }

  const client = new Client();
  client.on('debug', log);
  client.on('data', (chunk) => String(chunk).split(/\r?\n/).filter(Boolean).forEach(log));
  client.on('progress', ({ type, task, total }) =>
    emit('progress', { label: `Downloading ${type}`, current: task, total })
  );

  let resolveClosed;
  const closed = new Promise((resolve) => (resolveClosed = resolve));
  client.on('close', (code) => resolveClosed(code));

  emit('status', { state: 'preparing', message: 'Downloading game files…' });
  const child = await client.launch({
    authorization,
    root,
    javaPath,
    version: { number: mcVersion, type: 'release', ...(custom ? { custom } : {}) },
    memory: { max: ramMb, min: Math.min(ramMb, 1024) },
    customArgs: useJvmFlags ? JVM_FLAGS : [],
    overrides: { detached: false, gameDirectory: gameDir },
  });
  if (!child) throw new Error('Minecraft could not be started. Open the Console tab for details.');

  emit('status', { state: 'running', message: `Minecraft ${mcVersion} is running` });
  return { stop: () => child.kill(), closed };
}

module.exports = { launchGame, JVM_FLAGS };
