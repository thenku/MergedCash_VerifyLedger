const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // More on preload later
      nodeIntegration: true, // Be cautious with nodeIntegration for security
      contextIsolation: false, // Be cautious with contextIsolation for security
    }
  });

  win.loadFile('index.html'); // Load your HTML file

  // Open DevTools (optional, for development)
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Quit the app when all windows are closed, except on macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// In main.js, after win.loadFile('index.html');
const { ipcMain } = require('electron');
const fs = require('fs');
const { dialog } = require('electron');

ipcMain.on('message-from-renderer', (event, message) => {
  console.log('Received message from renderer:', message);
  // Send a message back to the renderer
  event.sender.send('message-from-main', 'Hello from the main process!');
});

ipcMain.on('open-csv-file', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  });

  if (result.canceled) {
    event.sender.send('csv-file-data', { error: 'No file selected' });
    return;
  }

  const filePath = result.filePaths[0];
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      event.sender.send('csv-file-data', { error: 'Failed to read file' });
      return;
    }

    const rows = data.split('\n').map(row => row.split(','));
    event.sender.send('csv-file-data', { rows });
  });
});