const { dialog, app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const { createWriteStream } = require('node:fs');

let logger = createWriteStream('/Users/nini/Downloads/logg.txt', { flags: 'a' });

const log = {
    log: (data) => logger.write('\n' + JSON.stringify(data)),
    info: (data) => logger.write('\n' + JSON.stringify(data)),
    warn: (data) => logger.write('\n' + JSON.stringify(data)),
    error: (data) => logger.write('\n' + JSON.stringify(data))
}


module.exports = () => {
    return new Promise((resolve) => {
        autoUpdater.logger = log;
        log.log('App starting...');

        autoUpdater.autoDownload = true;

        app.whenReady().then(async () => {
            const win = new BrowserWindow({
                width: 500,
                height: 528,
                fullscreenable: false,
                frame: true,
                maximizable: false,
                resizable: false,
                title: 'Some Testing Updater',
                movable: true,
                icon: "./assets/someicon.png",
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });

            win.loadFile(`./updater.html`);


            win.once('ready-to-show', async () => {
                win.webContents.send('statusUpdate', `Checking for updates...`);
                let update = await autoUpdater.checkForUpdates();
                if (update) {
                    win.webContents.send('progressUpdate', 0);
                    win.webContents.send('statusUpdate', `Update found! v${update.updateInfo.version}`);
                }
                else {
                    win.webContents.send('statusUpdate', `Up to date! Opening the app!`);
                    setTimeout(() => {
                        win.close();
                        return resolve(true);
                    }, 1000)
                }
            });


            autoUpdater.on('error', (err) => {
                win.webContents.send('statusUpdate', `Something went wrong...`);
                dialog.showErrorBox('An error occured...', `This shouldn't happend. Check your internet connection, restart the app and try again.\n\nFULL ERROR: ${err}`)
            });

            autoUpdater.on('download-progress', (progressObj) => {
                win.webContents.send('progressUpdate', progressObj.percent);
            });

            autoUpdater.on('update-downloaded', () => {
                win.webContents.send('statusUpdate', `Installing update...`);

                autoUpdater.quitAndInstall();
            })
        });
    });
};