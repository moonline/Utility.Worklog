"use strict";

const Path = require('path');
const OS = require('os');

const Config = require('./src/config');
const CSV = require('./src/csv');
const File = require('./src/file');
const Ledger = require('./src/ledger');


const [nodePath, scriptPath, worklogPath] = process.argv;
const worklogFile = new File(worklogPath);
if (!worklogFile.exists) {
    throw new Error(`Worklog "${absoluteWorklogPath}" not existing`);
}

const applicationConfig = Config.createFromPath('.worklog/config.json', 'application');
console.log(applicationConfig);

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

const csv = new CSV(worklogFile);
const ledger = Ledger.createFromDict('work', csv.rows);

console.log(
    ledger.dailyReport,
    ledger.total,
    ledger.hoursPerDay
);
