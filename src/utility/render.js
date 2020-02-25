"use strict";

const Handlebars = require('handlebars');
const FS = require('fs');
const TMP = require('tmp');
const Open = require('open');

module.exports = {
    renderTemplate: (templatePath, data) => {
        const templateFileContent = FS.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateFileContent);
        const tmpFile = TMP.fileSync();

        FS.writeFileSync(tmpFile.name, template(data),'utf-8');

        Open(tmpFile.name);
    }
}

