'use strict';
const fs = require('fs');
const path = require('path');
const { getJson } = require('./net');

const META = 'https://meta.fabricmc.net/v2/versions/loader';

/**
 * Installs the newest stable Fabric Loader profile for `mcVersion` into `<root>/versions`
 * and returns its version id (what MCLC calls `version.custom`).
 */
async function ensureFabric({ root, mcVersion }) {
  const loaders = await getJson(`${META}/${encodeURIComponent(mcVersion)}`);
  if (!loaders.length) throw new Error(`Fabric does not support Minecraft ${mcVersion}`);

  const pick = loaders.find((l) => l.loader.stable) || loaders[0];
  const loaderVersion = pick.loader.version;
  const id = `fabric-loader-${loaderVersion}-${mcVersion}`;

  const profilePath = path.join(root, 'versions', id, `${id}.json`);
  if (!fs.existsSync(profilePath)) {
    const profile = await getJson(
      `${META}/${encodeURIComponent(mcVersion)}/${encodeURIComponent(loaderVersion)}/profile/json`
    );
    fs.mkdirSync(path.dirname(profilePath), { recursive: true });
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  }
  return id;
}

module.exports = { ensureFabric };
