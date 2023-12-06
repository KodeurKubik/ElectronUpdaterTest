const { autoUpdater, app, BrowserWindow, ipcMain, dialog } = require('electron');

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

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {

        let whatToDo = dialog.showMessageBoxSync(win, {
            message: `An update is available! You're on version v${require('./package.json').version}. Newest is ${releaseName}.`,
            buttons: [
                "OK",
                "Install and Restart",
            ],
            defaultId: 0,
            cancelId: 0,
            detail: releaseNotes,
            title: "New Update Available!",
            icon: "./assets/someicon.png",
            type: 'question'
        })

        // If install
        if (whatToDo == 1) autoUpdater.quitAndInstall()
    });

    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', { version: app.getVersion() });
    });
});