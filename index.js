const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = console;
console.log('App starting...');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

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

    win.loadFile(`./page.html`, { hash: `v${app.getVersion()}` });

    win.webContents.openDevTools();



    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdates();
    });


    function sendStatusToWindow(text) {
        log.info(text);
        win.webContents.send('message', text);
    }

    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        sendStatusToWindow('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendStatusToWindow(log_message);
    })
    autoUpdater.on('update-downloaded', (ev, info) => {
        sendStatusToWindow('Update downloaded');

        console.log(info);

        let whatToDo = dialog.showMessageBoxSync(win, {
            message: `An update is available! You're on version v${require('./package.json').version}. Newest is ${null}.`,
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
    })

    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', { version: app.getVersion() });
    });
});