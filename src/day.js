"use strict";

const moment = require('moment');

/**
 * @typedef {"Public holiday"|"Workday"|"Weekend"} DayType
 */

/**
 * Raw day
 * @typedef {Object} CalendarDayConfig
 * @property {number} workingHoursPerDay
 */

/**
 * Raw day
 * @typedef {Object} CalendarRow
 * @property {string} day - Date in format "dd/mm/yy"
 * @property {number} quantity - Complete day (1) or fragment (e.g. 0.5, 0.25)
 * @property {DayType} type - Type of day
 */

module.exports = class Day {
    /**
     * @param {moment} date 
     */
    static dateKey(date) {
        return date ? date.format("DD/MM/YY") : null;
    }

    /**
     * @param {string} day Day in format "dd/mm/yy"
     */
    static parseMoment(day) {
        return day ? moment(day, "DD/MM/YY") : null;
    }

    /**
     * @param {string} day - Day in format "dd/mm/yy"
     * @returns {"Workday"|"Weekend"}
     */
    static getTypeFromWeekday(date) {
        return date.isoWeekday() <= 5
            ? 'Workday'
            : 'Weekend';
    }

    /**
     * @param {CalendarRow} calendarRow - A raw calendar row { day: "26/08/19", quantity: 1, type: "Public holiday" }
     * @param {CalendarDayConfig} config
     * @returns {Day}
     */
    static createFromDict({ day, quantity, type }, config) {
        return new Day(Day.parseMoment(day), quantity, type, config);
    }

    /**
     * @param {moment} date
     * @param {CalendarDayConfig} config
     * @returns {Day}
     */
    static createFromDate(date, config) {
        return new Day(
            date,
            1,
            Day.getTypeFromWeekday(date),
            config
        );
    }

    /**
     * @param {moment} date
     * @param {number} quantity 
     * @param {DayType} type 
     * @param {CalendarDayConfig} config 
     */
    constructor(date, quantity, type, config = { workingHoursPerDay: 8 }) {
        this.date = date;
        this.quantity = quantity;
        this.type = type;
        this.config = config;
    }

    get key() {
        return Day.dateKey(this.date);
    }

    get weekDayName() {
        return this.date.format('dddd');
    }

    get isWorkday() {
        return Boolean(this.type === "Workday");
    }

    get workingHoursDebt() {
        return this.isWorkday
            ? this.config.workingHoursPerDay * this.quantity
            : 0;
    }

    get nextDay() {
        return this.date.add(1,'days');
    }
};
