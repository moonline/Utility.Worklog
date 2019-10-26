"use strict";

const { round, iteratableObject } = require('./utility');

const Accounting = require('./accounting');


module.exports = class Ledger {
    /**
     * @param {string} name 
     * @param {AccountingRow[]} dict
     * @returns {Ledger}
     */
    static createFromDict(name, dict) {
        return new Ledger(
            name,
            dict.map(Accounting.createFromDict)
        );
    }

    constructor(name, accountings = []) {
        this.name = name;
        this.accountings = accountings;
    }

    get total() {
        return this.accountings.reduce(
            (sum, accounting) => (sum + accounting.hours), 0
        );
    }

    get days() {
        return (new Set(
            this.accountings.map(accounting => accounting.date)
        )).size
    }

    get hoursPerDay() {
        return this.total / this.days;
    }

    get groupByDay() {
        return this.accountings.reduce(
            (days, accounting) => ({
                ...days,
                [accounting.date]: [
                    ...(days[accounting.date] || []),
                    accounting.hours
                ]
            }),
            {}
        );
    }

    get hoursByDay() {
        return iteratableObject(
            this.groupByDay, 
            entries => entries
                .map(([day, hourEntries]) => [
                    day, 
                    hourEntries.reduce((sum, row) => (sum + row), 0),
                ])
                .map(([day, hours]) => [day, round(hours) ])
        );
    }
}
