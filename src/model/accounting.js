"use strict";

/**
 * Raw accounting
 * @typedef {Object} AccountingRow
 * @property {string} day - Date in format "dd/mm/yy"
 * @property {string} start - Start hour in format "hh:mm"
 * @property {string} end - End hour in format "hh:mm"
 */

module.exports = class Accounting {
    /**
     * @param {AccountingRow} accountingRow - A raw accounting like { day: "26/08/19", start: "09:15", end: "15:30" }
     * @returns {Accounting}
     */
    static createFromDict({ day, start, end}) {
        return new Accounting(day, start, end);
    }

    constructor(date, from, to) {
        this.date = date;
        this.from = from;
        this.to = to;
    }

    get hours() {
        const [fromHr, fromMin] = this.from.split(':');
        const [toHr, toMin] = this.to.split(':');
        const fromMinutes = parseInt(fromHr) * 60 + parseInt(fromMin);
        const toMinutes = parseInt(toHr) * 60 + parseInt(toMin);

        return (toMinutes - fromMinutes) / 60;
    }
}
