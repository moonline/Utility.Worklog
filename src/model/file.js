"use strict";

const Path = require('path');
const FS = require('fs');
const OS = require('os');


module.exports = class File {
    static pathWithoutExtension(filePath) {
        return Path.basename(filePath, Path.extname(filePath));
    }

    /**
     * @param {string} path Path relative to user directory
     */
    constructor(path = '') {
        this.path = path;
        try {
            this.content = this.exists
                ? FS.readFileSync(this.absolutePath, 'utf8')
                : '';
        } catch (error) {
            this.content = '';
            throw new Error(`Can not read file "${this.absolutePath}"!`)
        }
    }

    set path(path) {
	this.relativePath = path;
        this.absolutePath = FS.existsSync(path) ? Path.resolve(path) : Path.join(OS.homedir(), path);
    }
    
    get exists() {
        return FS.existsSync(this.absolutePath);
    }
}
