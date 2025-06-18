// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Expose a function to send a message to the main process
  sendMessage: (message) => ipcRenderer.send('message-from-renderer', message),
  // Example: Expose a function to receive messages from the main process
  onMessage: (callback) => ipcRenderer.on('message-from-main', (event, message) => callback(message))
});