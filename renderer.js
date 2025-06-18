console.log('Hello from the renderer process!');

// renderer.js
window.electronAPI.sendMessage('Hello from the UI!');

window.electronAPI.onMessage((message) => {
  console.log('Received message from main:', message);
});