'use strict';
const fs = require('fs');
const path = require('path');

const LOADERS = ['fabric', 'vanilla'];

/** JSON settings file with validation, so a hand-edited or corrupt file cannot break the launcher. */
function createSettings({ file, totalMemMb }) {
  const maxRam = Math.max(1024, Math.floor(totalMemMb / 256) * 256);
  const defaults = {
    version: null,
    loader: 'fabric',
    ramMb: Math.min(4096, Math.max(1024, Math.floor((totalMemMb * 0.5) / 256) * 256)),
    jvmFlags: true,
    optimize: true,
  };

  function sanitize(input) {
    const out = { ...defaults };
    if (typeof input.version === 'string' && /^[0-9A-Za-z._-]{1,32}$/.test(input.version)) out.version = input.version;
    if (LOADERS.includes(input.loader)) out.loader = input.loader;
    if (Number.isFinite(input.ramMb)) out.ramMb = Math.min(maxRam, Math.max(1024, Math.round(input.ramMb)));
    if (typeof input.jvmFlags === 'boolean') out.jvmFlags = input.jvmFlags;
    if (typeof input.optimize === 'boolean') out.optimize = input.optimize;
    return out;
  }

  let current;
  try {
    current = sanitize(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch {
    current = { ...defaults };
  }

  return {
    maxRam,
    get: () => ({ ...current }),
    set(patch) {
      current = sanitize({ ...current, ...patch });
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(current, null, 2));
      return { ...current };
    },
  };
}

module.exports = { createSettings };
