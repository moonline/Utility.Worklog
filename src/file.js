"use strict";

const Path = require('path');
const FS = require('fs');
const OS = require('os');


module.exports = class File {
    static pathWithoutExtension(filePath) {
        return Path.basename(filePath, Path.extname(filePath));
    }

    /**
     * @param {string} relativePath Path relative to user directory
     */
    constructor(relativePath = '') {
        this.relativePath = relativePath;
        this.absolutePath = Path.join(OS.homedir(), this.relativePath);
        try {
            this.content = this.exists
                ? FS.readFileSync(this.absolutePath, 'utf8')
                : '';
        } catch (error) {
            this.content = '';
            throw new Error(`Can not read file "${this.absolutePath}"!`)
        }
    }
    
    get exists() {
        return FS.existsSync(this.absolutePath);
    }
}