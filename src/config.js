const File = require('./file');
const DEFAULT_CONFIG = {
    'worklog': require('../config/worklog.config.json'),
    'application': require('../config/application.config.json')
};


module.exports = class Config {
    static createFromPath(filePath, type) {
        let configFile = new File(filePath);
        return new Config(configFile, type);
    }

    /**
     * @param string filePath
     * @param 'application'|'worklog' type
     */
    constructor(configFile, type) {
        this.configFile = configFile;
        this.configContent = JSON.parse(
            this.configFile.content.length > 0
                ? this.configFile.content
                : '{}'
            );
        this.type = type;
    }

    get config() {
        return {
            ...DEFAULT_CONFIG[this.type] || {},
            ...this.configContent
        }
    }
}