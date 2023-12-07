const { app, BrowserWindow, ipcMain } = require('electron');

require('./updater')()
    .then(async () => {
        const win = new BrowserWindow({
            width: 1280,
            height: 720,
            fullscreenable: false,
            frame: true,
            maximizable: false,
            resizable: true,
            title: 'Some Electron Testing',
            movable: true,
            icon: "./assets/someicon.png",
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        win.loadFile(`./page.html`, { hash: `v${app.getVersion()}` });

        // win.webContents.openDevTools();

        ipcMain.on('app_version', (event) => {
            event.sender.send('app_version', { version: app.getVersion() });
        });
    });