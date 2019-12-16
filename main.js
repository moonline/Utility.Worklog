"use strict";

const Path = require('path');
const OS = require('os');

const Config = require('./src/config');
const CSV = require('./src/csv');
const File = require('./src/file');
const Ledger = require('./src/ledger');
const Calendar = require('./src/calendar');
const Workbook = require('./src/workbook');


const [nodePath, scriptPath, worklogPath] = process.argv;
const worklogFile = new File(worklogPath);
if (!worklogFile.exists) {
    throw new Error(`Worklog "${absoluteWorklogPath}" not existing`);
}

const applicationConfig = Config.createFromPath('.worklog/config.json', 'application');

const worklogCalendarPath = Path.join(
    Path.dirname(worklogFile.relativePath),
    File.pathWithoutExtension(worklogFile.relativePath) + applicationConfig.config.worklogCalendarExtension
);
const calendarFile = new File(worklogCalendarPath);

const worklogConfigPath = Path.join(
    Path.dirname(worklogFile.relativePath),
    File.pathWithoutExtension(worklogFile.relativePath) + applicationConfig.config.worklogConfigExtension
);
const worklogConfig = Config.createFromPath(worklogConfigPath, 'worklog');

const calendarCsv = new CSV(calendarFile);
const calendar = Calendar.createFromDict(calendarCsv.rows, worklogConfig.configContent);

const worklogCsv = new CSV(worklogFile);
const ledger = Ledger.createFromDict('work', worklogCsv.rows);

const workbook = new Workbook(calendar, [ledger]);

console.log(workbook.dailyLog);
console.log(workbook.statistics);
