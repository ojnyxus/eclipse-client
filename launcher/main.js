'use strict';
const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createAuthService } = require('./src/auth');
const { createSettings } = require('./src/settings');
const { listVersions } = require('./src/core/versions');
const { launchGame, JVM_FLAGS } = require('./src/core/game');

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

const totalMemMb = Math.floor(os.totalmem() / 1048576);
let win = null;
let session = null; // { stop, closed } while Minecraft is running
let launching = false;

const dataDir = () => app.getPath('userData');
const gameRoot = () => path.join(dataDir(), 'minecraft');

// The Microsoft refresh token is encrypted with the OS keychain (DPAPI on Windows).
// If the OS cannot encrypt, it is kept in memory only and never written to disk.
let memoryToken = null;
const tokenFile = () => path.join(dataDir(), 'account.bin');
const tokenStore = {
  load() {
    if (memoryToken) return memoryToken;
    try {
      return safeStorage.decryptString(fs.readFileSync(tokenFile()));
    } catch {
      return null;
    }
  },
  save(token) {
    memoryToken = token;
    if (safeStorage.isEncryptionAvailable()) {
      fs.mkdirSync(dataDir(), { recursive: true });
      fs.writeFileSync(tokenFile(), safeStorage.encryptString(token));
    }
  },
  clear() {
    memoryToken = null;
    fs.rmSync(tokenFile(), { force: true });
  },
};

let auth;
let settings;

function send(event) {
  if (win && !win.isDestroyed()) win.webContents.send('game:event', event);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    show: false,
    backgroundColor: '#06070a',
    title: 'Eclipse Client',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event) => event.preventDefault());
  win.on('closed', () => {
    win = null;
  });
}

function registerIpc() {
  ipcMain.handle('app:info', () => ({
    version: app.getVersion(),
    totalMemMb,
    maxRamMb: settings.maxRam,
    jvmFlags: JVM_FLAGS,
  }));

  ipcMain.handle('settings:get', () => settings.get());
  ipcMain.handle('settings:set', (_event, patch) => settings.set(patch || {}));
  ipcMain.handle('versions:list', (_event, loader) => listVersions(loader === 'vanilla' ? 'vanilla' : 'fabric'));

  ipcMain.handle('auth:status', () => auth.getProfile());
  ipcMain.handle('auth:login', () => auth.login());
  ipcMain.handle('auth:logout', () => {
    auth.logout();
  });

  ipcMain.handle('game:launch', async () => {
    if (launching || session) throw new Error('Minecraft is already running.');
    const options = settings.get();
    if (!options.version) throw new Error('Pick a Minecraft version first.');

    launching = true;
    try {
      send({ type: 'status', state: 'preparing', message: 'Signing in…' });
      const authorization = await auth.getSession();
      const started = await launchGame({
        root: gameRoot(),
        authorization,
        mcVersion: options.version,
        loader: options.loader,
        ramMb: options.ramMb,
        useJvmFlags: options.jvmFlags,
        optimize: options.optimize,
        emit: (type, payload) => send({ type, ...payload }),
      });
      session = started;
      started.closed.then((code) => {
        session = null;
        send({
          type: 'status',
          state: 'idle',
          message: code === 0 || code === null ? 'Minecraft closed.' : `Minecraft exited with code ${code}.`,
        });
      });
    } catch (err) {
      send({ type: 'status', state: 'error', message: err.message || String(err) });
      throw err;
    } finally {
      launching = false;
    }
  });

  ipcMain.handle('game:stop', () => {
    if (session) session.stop();
  });

  ipcMain.handle('game:openFolder', () => {
    fs.mkdirSync(gameRoot(), { recursive: true });
    return shell.openPath(gameRoot());
  });

  ipcMain.on('win:minimize', () => win && win.minimize());
  ipcMain.on('win:maximize', () => win && (win.isMaximized() ? win.unmaximize() : win.maximize()));
  ipcMain.on('win:close', () => win && win.close());
}

app.whenReady().then(() => {
  settings = createSettings({ file: path.join(dataDir(), 'settings.json'), totalMemMb });
  auth = createAuthService({ store: tokenStore });
  registerIpc();
  createWindow();
  auth.restore().then((profile) => profile && send({ type: 'account', profile }));
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('window-all-closed', () => app.quit());
