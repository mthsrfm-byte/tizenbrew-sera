"use strict";

const fs = require('fs');

const CONFIG_PATH = '/home/owner/share/tizenbrewConfig.json';
const SERAFLIX_MODULE = 'gh/mthsrfm-byte/stremio-sera';

function readConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        return {
            modules: [SERAFLIX_MODULE, "npm/@foxreis/tizentube"],
            autoLaunchServiceList: [],
            autoLaunchModule: '',
            seraflixAdded: true
        };
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    // TV que já tinha o TizenBrew: coloca o Seraflix na lista uma vez só
    // (se depois a pessoa remover, ele não volta).
    if (!config.seraflixAdded) {
        config.seraflixAdded = true;
        if (config.modules.indexOf(SERAFLIX_MODULE) === -1) config.modules.unshift(SERAFLIX_MODULE);
        writeConfig(config);
    }
    return config;
}

function writeConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
}

module.exports = {
    readConfig,
    writeConfig
};
