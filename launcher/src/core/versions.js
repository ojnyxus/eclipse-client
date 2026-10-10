'use strict';
const { getJson } = require('./net');

const MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
const FABRIC_GAME_URL = 'https://meta.fabricmc.net/v2/versions/game';

let manifestPromise = null;
function getManifest() {
  if (!manifestPromise) {
    manifestPromise = getJson(MANIFEST_URL).catch((err) => {
      manifestPromise = null;
      throw err;
    });
  }
  return manifestPromise;
}

/** Full Mojang version JSON for a release id (contains javaVersion, assets, libraries…). */
async function getVersionMeta(id) {
  const manifest = await getManifest();
  const entry = manifest.versions.find((v) => v.id === id);
  if (!entry) throw new Error(`Unknown Minecraft version: ${id}`);
  return getJson(entry.url);
}

/** Release versions, newest first. Fabric only lists versions the Fabric installer supports. */
async function listVersions(loader) {
  const manifest = await getManifest();
  let releases = manifest.versions.filter((v) => v.type === 'release').map((v) => v.id);
  if (loader === 'fabric') {
    const games = await getJson(FABRIC_GAME_URL);
    const supported = new Set(games.filter((g) => g.stable).map((g) => g.version));
    releases = releases.filter((id) => supported.has(id));
  }
  return releases;
}

module.exports = { getVersionMeta, listVersions };
