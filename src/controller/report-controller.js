"use strict";

const Path = require('path');
const FS = require('fs');
const Handlebars = require('handlebars');

const Config = require('../model/config');
const CSV = require('../model/csv');
const File = require('../model/file');
const Ledger = require('../model/ledger');
const Calendar = require('../model/calendar');
const Workbook = require('../model/workbook');


module.exports = {
    ReportController: class ReportController {
        constructor() {
            this.applicationConfig = Config.createFromPath('.worklog/config.json', 'application');
        }

        listAction = (worklogPath) => {
            // TODO move parts to a WorklogRepository
            const worklogFile = new File(worklogPath);
            if (!worklogFile.exists) {
                throw new Error(`Worklog "${absoluteWorklogPath}" not existing`);
            }

            const worklogCalendarPath = Path.join(
                Path.dirname(worklogFile.relativePath),
                File.pathWithoutExtension(worklogFile.relativePath) + this.applicationConfig.config.worklogCalendarExtension
            );
            const calendarFile = new File(worklogCalendarPath);

            const worklogConfigPath = Path.join(
                Path.dirname(worklogFile.relativePath),
                File.pathWithoutExtension(worklogFile.relativePath) + this.applicationConfig.config.worklogConfigExtension
            );
            const worklogConfig = Config.createFromPath(worklogConfigPath, 'worklog');

            const calendarCsv = new CSV(calendarFile);
            const calendar = Calendar.createFromDict(calendarCsv.rows, worklogConfig.configContent);

            const worklogCsv = new CSV(worklogFile);
            const ledger = Ledger.createFromDict('work', worklogCsv.rows);

            const workbook = new Workbook(calendar, [ledger]);

            return this.render(
                Path.join(__dirname, '../templates/list.hbs.html'),
                { weeks: workbook.weeklyLog, statistics: workbook.statistics }
            );
        }

        indexAction = () => {
            return this.render(
                Path.join(__dirname, '../templates/index.hbs.html'),
                {}
            );
        }

        render = (templatePath, data) => {
            const templateFileContent = FS.readFileSync(templatePath, 'utf-8');
            const template = Handlebars.compile(templateFileContent);

            return template(data);
        }
    }
}
