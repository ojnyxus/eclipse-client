'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eclipse', {
  info: () => ipcRenderer.invoke('app:info'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (patch) => ipcRenderer.invoke('settings:set', patch),
  listVersions: (loader) => ipcRenderer.invoke('versions:list', loader),
  authStatus: () => ipcRenderer.invoke('auth:status'),
  login: () => ipcRenderer.invoke('auth:login'),
  logout: () => ipcRenderer.invoke('auth:logout'),
  launch: () => ipcRenderer.invoke('game:launch'),
  stop: () => ipcRenderer.invoke('game:stop'),
  openGameFolder: () => ipcRenderer.invoke('game:openFolder'),
  minimize: () => ipcRenderer.send('win:minimize'),
  maximize: () => ipcRenderer.send('win:maximize'),
  close: () => ipcRenderer.send('win:close'),
  onGameEvent: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('game:event', handler);
    return () => ipcRenderer.removeListener('game:event', handler);
  },
});
