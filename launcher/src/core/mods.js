'use strict';
const fs = require('fs');
const path = require('path');
const { getJson, downloadFile } = require('./net');

// The Fabric optimization stack from the README: rendering, game logic, memory.
const OPTIMIZATION_MODS = ['sodium', 'lithium', 'ferrite-core'];
const MODRINTH = 'https://api.modrinth.com/v2';

async function findVersion(project, mcVersion) {
  const query =
    `loaders=${encodeURIComponent('["fabric"]')}` +
    `&game_versions=${encodeURIComponent(JSON.stringify([mcVersion]))}`;
  const versions = await getJson(`${MODRINTH}/project/${encodeURIComponent(project)}/version?${query}`);
  return versions.find((v) => v.version_type === 'release') || versions[0] || null;
}

function readState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Downloads the newest Modrinth build of each optimization mod (and its required
 * dependencies) into `<gameDir>/mods`. Only files this function created are ever removed.
 */
async function ensureOptimizationMods({ gameDir, mcVersion, log = () => {} }) {
  const modsDir = path.join(gameDir, 'mods');
  const statePath = path.join(modsDir, '.eclipse-managed.json');
  fs.mkdirSync(modsDir, { recursive: true });

  const previous = readState(statePath);
  const current = {};

  async function install(project) {
    const version = await findVersion(project, mcVersion);
    if (!version) {
      log(`[Eclipse] ${project}: no Fabric build for Minecraft ${mcVersion}, skipping`);
      return;
    }
    if (current[version.project_id]) return;

    const file = version.files.find((f) => f.primary) || version.files[0];
    const downloaded = await downloadFile(file.url, path.join(modsDir, file.filename), {
      sha1: file.hashes && file.hashes.sha1,
    });
    current[version.project_id] = file.filename;
    log(`[Eclipse] ${project}: ${file.filename}${downloaded ? ' (downloaded)' : ' (up to date)'}`);

    for (const dep of version.dependencies || []) {
      if (dep.dependency_type === 'required' && dep.project_id) await install(dep.project_id);
    }
  }

  for (const project of OPTIMIZATION_MODS) await install(project);

  // Remove builds we installed earlier that have been superseded.
  for (const [projectId, filename] of Object.entries(previous)) {
    if (current[projectId] !== filename) fs.rmSync(path.join(modsDir, filename), { force: true });
  }
  fs.writeFileSync(statePath, JSON.stringify(current, null, 2));
  return Object.values(current);
}

module.exports = { ensureOptimizationMods };
