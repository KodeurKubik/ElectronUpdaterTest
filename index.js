const { app, BrowserWindow } = require('electron');


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
        icon: "./assets/someicon.png"
    });

    require('./updater')()

    win.loadURL('https://duckduckgo.com');

    win.webContents.openDevTools();
});