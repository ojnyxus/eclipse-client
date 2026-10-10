'use strict';
const fs = require('fs');
const path = require('path');
const { getJson, downloadFile, runPool, safeJoin } = require('./net');
const { getVersionMeta } = require('./versions');

// Mojang's own list of bundled Java runtimes (the same source the official launcher uses).
const RUNTIME_INDEX =
  'https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json';

function runtimePlatform() {
  const { platform, arch } = process;
  if (platform === 'win32') {
    if (arch === 'arm64') return 'windows-arm64';
    return arch === 'ia32' ? 'windows-x86' : 'windows-x64';
  }
  if (platform === 'darwin') return arch === 'arm64' ? 'mac-os-arm64' : 'mac-os';
  return arch === 'ia32' ? 'linux-i386' : 'linux';
}

function javaBinary(dir) {
  if (process.platform === 'win32') return path.join(dir, 'bin', 'javaw.exe');
  if (process.platform === 'darwin') return path.join(dir, 'jre.bundle', 'Contents', 'Home', 'bin', 'java');
  return path.join(dir, 'bin', 'java');
}

/**
 * Makes sure the Java runtime that `mcVersion` needs is installed under `<root>/runtime`
 * and returns the path to its executable. Nothing needs to be installed on the user's PC.
 */
async function ensureJava({ root, mcVersion, onProgress = () => {} }) {
  const meta = await getVersionMeta(mcVersion);
  const component = (meta.javaVersion && meta.javaVersion.component) || 'jre-legacy';
  const platformKey = runtimePlatform();

  const index = await getJson(RUNTIME_INDEX);
  const entry = index[platformKey] && index[platformKey][component] && index[platformKey][component][0];
  if (!entry) throw new Error(`Mojang publishes no "${component}" Java runtime for ${platformKey}`);

  const dir = path.join(root, 'runtime', component, platformKey);
  const java = javaBinary(dir);
  const marker = path.join(dir, '.eclipse-complete');
  const stamp = entry.manifest.sha1;
  if (fs.existsSync(java) && fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === stamp) return java;

  const { files } = await getJson(entry.manifest.url);
  const list = Object.entries(files);

  for (const [rel, file] of list) {
    if (file.type === 'directory') fs.mkdirSync(safeJoin(dir, rel), { recursive: true });
  }

  const downloads = list.filter(([, file]) => file.type === 'file');
  let done = 0;
  await runPool(downloads, 8, async ([rel, file]) => {
    const dest = safeJoin(dir, rel);
    await downloadFile(file.downloads.raw.url, dest, { sha1: file.downloads.raw.sha1 });
    if (file.executable && process.platform !== 'win32') fs.chmodSync(dest, 0o755);
    onProgress({ current: ++done, total: downloads.length });
  });

  for (const [rel, file] of list) {
    if (file.type !== 'link') continue;
    const dest = safeJoin(dir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.rmSync(dest, { force: true });
    fs.symlinkSync(file.target, dest);
  }

  fs.writeFileSync(marker, stamp);
  return java;
}

module.exports = { ensureJava };
