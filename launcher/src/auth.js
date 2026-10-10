'use strict';
const { Auth } = require('msmc');

const FRIENDLY_ERRORS = [
  ['error.gui.closed', 'The sign-in window was closed before finishing.'],
  ['error.auth.minecraft.profile', 'This Microsoft account does not own Minecraft: Java Edition.'],
  ['error.auth.xboxlive', 'This Microsoft account has no Xbox profile yet. Create one at xbox.com and try again.'],
  ['error.auth.xsts', 'Xbox sign-in was refused for this account (age / region restriction or no Xbox profile).'],
];

function explain(err) {
  const raw = typeof err === 'string' ? err : (err && err.message) || String(err);
  const match = FRIENDLY_ERRORS.find(([code]) => raw.includes(code));
  return new Error(match ? match[1] : raw);
}

/**
 * Microsoft / Minecraft sign-in. `store` persists only the Microsoft refresh token:
 * `{ load(): string | null, save(token: string): void, clear(): void }`.
 */
function createAuthService({ store }) {
  let profile = null;

  async function finish(xbox) {
    const minecraft = await xbox.getMinecraft();
    store.save(xbox.save());
    profile = { name: minecraft.profile.name, uuid: minecraft.profile.id };
    return minecraft;
  }

  /** Opens Microsoft's sign-in window. */
  async function login() {
    try {
      const xbox = await new Auth('select_account').launch('electron');
      await finish(xbox);
      return profile;
    } catch (err) {
      throw explain(err);
    }
  }

  /** Exchanges the stored refresh token for a fresh Minecraft session (MCLC format). */
  async function getSession() {
    const token = store.load();
    if (!token) throw new Error('Sign in with Microsoft first.');
    try {
      const xbox = await new Auth('select_account').refresh(token);
      const minecraft = await finish(xbox);
      return minecraft.mclc();
    } catch (err) {
      store.clear();
      profile = null;
      throw new Error(`Your session expired — please sign in again. (${explain(err).message})`);
    }
  }

  /** Silent sign-in on startup; resolves to the profile or null. */
  async function restore() {
    if (!store.load()) return null;
    try {
      await getSession();
      return profile;
    } catch {
      return null;
    }
  }

  function logout() {
    store.clear();
    profile = null;
  }

  return { login, getSession, restore, logout, getProfile: () => profile };
}

module.exports = { createAuthService };
