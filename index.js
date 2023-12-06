const { autoUpdater, app, BrowserWindow, ipcMain } = require('electron');
const { dialog } = require('electron')



app.whenReady().then(async () => {
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

    win.loadFile('./page.html');

    win.webContents.openDevTools();



    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdates();
    });

    autoUpdater.on('update-available', () => {
        win.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        win.webContents.send('update_downloaded');
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });
    
    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', { version: app.getVersion() });
    });
});