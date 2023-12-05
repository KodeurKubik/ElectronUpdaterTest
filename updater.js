const { updateElectronApp, UpdateSourceType } = require("update-electron-app");

module.exports = () => {
    updateElectronApp({
        updateSource: {
            type: UpdateSourceType.ElectronPublicUpdateService,
            repo: 'KodeurKubik/ElectronUpdaterTest'
        },
        notifyUser: true,
        updateInterval: '5 minutes',
        logger: console,
    });
}