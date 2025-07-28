const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateWallet: (crypto) => ipcRenderer.invoke('generate-wallet', crypto)
});