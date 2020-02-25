"use strict";

const { round, iteratableObject } = require('../utility/utility');


const isNotWeekendWithoutMovement = ([dayKey, dayEntry]) => 
    !(dayEntry.debt === 0 && dayEntry.hours === 0 && dayEntry.type === 'Weekend')


module.exports = class Workbook {
    constructor(calendar, ledgers) {
        this.calendar = calendar;
        this.ledgers = ledgers;
    }

    get calendarByDay() {
        const ledgersByDay = this.ledgers.map(ledger => ledger.hoursByDay);
        return iteratableObject(
            this.calendar.daysByDay,
            entries => entries.map(([dayKey, day]) => ([dayKey, {
                day: day,
                ledgers: ledgersByDay.map(ledger => ledger[dayKey] || 0)
            }]))
        );
    }

    /**
     * @return {Object.<string, {
     *      day: string, type: string, debt: number, hours: number, balance: number
     * }>}
     * @example { 
     *  '19/02/20': { day: 'Wednesday', type: 'Workday', debt: -8, hours: 8.33, balance: 0.33 },
     *  '20/02/20': { day: 'Thursday', type: 'Workday', debt: -8, hours: 8.92, balance: 0.92 }
     * }
     */
    get hoursByDay() {
        return iteratableObject(
            this.calendarByDay,
            entries => entries
                .map(([dayKey, dayEntry]) => ([dayKey, {
                    day: dayEntry.day.weekDayName,
                    weekNumber: dayEntry.day.weekNumber,
                    type: dayEntry.day.type,
                    debt: dayEntry.day.workingHoursDebt*-1,
                    hours: dayEntry.ledgers.reduce((sum, ledgerHours) => sum + ledgerHours)
                }]))
                .map(([dayKey, dayEntry]) => ([dayKey, {
                    ...dayEntry,
                    balance: round(dayEntry.hours + dayEntry.debt)
                }]))
        );
    }

    /**
     * @return {Object.<string, [debt, hours, balance, weekday, type]>}
     * @example { 
     *  '19/02/20': [ -8, 8.33, 0.33, 'Wednesday', 'Workday' ],
     *  '20/02/20': [ -8, 8.92, 0.92, 'Thursday', 'Workday' ]
     * }
     */
    get dailyLog() {
        return iteratableObject(
            this.hoursByDay,
            entries => entries
                .filter(isNotWeekendWithoutMovement)
                .map(([dayKey, dayEntry]) => ([dayKey, [
                    dayEntry.debt,
                    dayEntry.hours,
                    dayEntry.balance,
                    dayEntry.day,
                    dayEntry.type
                ]]))
        );
    }

    /**
     * @example {
     *  '9': {
     *    '17/02/20': { day: 'Monday', weekNumber: 8, type: 'Workday', debt: -8, hours: 8.17, balance: 0.17 },
     *    '18/02/20': { day: 'Tuesday', weekNumber: 8, type: 'Workday', debt: -8, hours: 8, balance: 0 }
     *  }
     * }
     */
    get weeklyLog() {
        return Object.entries(this.hoursByDay)
            .filter(isNotWeekendWithoutMovement)
            .reduce((weeks, [dayKey, dayEntry]) => ({
                ...weeks,
                [dayEntry.weekNumber]: weeks[dayEntry.weekNumber]
                    ? {
                        ...weeks[dayEntry.weekNumber],
                        [dayKey]: dayEntry
                    }
                    : { [dayKey]: dayEntry }
            }), {});
    }

    get balance() {
        return round(Object.entries(this.hoursByDay)
            .reduce((sum, [dayKey, dayEntry]) => 
                    sum+dayEntry.balance
                ,0
            ));
    }

    get dayTypesCount() {
        return Object.entries(this.hoursByDay)
            .map(([dayKey, dayEntry]) => dayEntry.type)
            .reduce((dayTypesCount, currentDayType) => ({
                    ...dayTypesCount,
                    [currentDayType]: (dayTypesCount[currentDayType] || 0)+1
            }), {})
    }
    
    get totalHours() {
        return round(Object.entries(this.hoursByDay)
            .reduce((sum, [dayKey, dayEntry]) => 
                    sum+dayEntry.hours
                ,0
            ));
    }

    get statistics() {
        return {
            balance: this.balance,
            dayTypes: this.dayTypesCount
        }
    }
}