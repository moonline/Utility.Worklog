"use strict";

const Handlebars = require('handlebars');
const FS = require('fs');

module.exports = {
    renderTemplate: (templatePath, data) => {
        const templateFileContent = FS.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateFileContent);

        return template(data);
    }
}

