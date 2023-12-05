const { updateElectronApp, UpdateSourceType } = require("update-electron-app");

module.exports = () => {
    updateElectronApp({
        updateSource: {
            type: UpdateSourceType.ElectronPublicUpdateService,
        },
        notifyUser: true,
        updateInterval: '5 minutes',
        logger: console,
    });
}