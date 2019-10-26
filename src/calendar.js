"use strict";

const moment = require('moment');

const Day = require('./day');


/**
 * Raw day
 * @typedef {Object} CalendarConfig
 * @property {string} startDay - Beginning of calendar in format "dd/mm/yy"
 */

/**
 * 
 * @param {moment} startDate 
 * @param {moment} endDate 
 * @returns {Iterator}
 */
function* makeDateRangeIterator(startDate = moment().startOf('year'), endDate = moment()) {
    let currentDay = moment(startDate);
    while (currentDay.isBefore(endDate)) {
        yield moment(currentDay);
        currentDay.add(1,'days');
    }
}


module.exports = class Calendar {
    /**
     * @param {CalendarRow[]} dict
     * @param {CalendarConfig} config
     * @returns {Calendar}
     */
    static createFromDict(dict, config = {}) {
        const daysDict = dict.reduce((days, currentDay) => ({
                ...days,
                [currentDay.day]: Day.createFromDict(currentDay, config)
            }),
            {}
        );
        return new Calendar(
            Calendar.daysList(Day.parseMoment(config.startDay)).map(day => {
                const dayKey = Day.dateKey(day);
                return (dayKey in daysDict)
                    ? daysDict[dayKey]
                    : Day.createFromDate(day, config);
                }
            )
        );
    }

    /**
     * @param {moment} startDate 
     */
    static daysList(startDate) {
        return Array.from(makeDateRangeIterator(startDate));
    }

    /**
     * @param {Day[]} days
     */
    constructor(days) {
        this.days = days;
    }

    get daysByDay() {
        return this.days.reduce((daysDict, currentDay) => ({
                ...daysDict,
                [currentDay.key]: currentDay
            }),
            {}
        );
    }
};
