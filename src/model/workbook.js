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

    get hoursByDay() {
        return iteratableObject(
            this.calendarByDay,
            entries => entries
                .map(([dayKey, dayEntry]) => ([dayKey, {
                    day: dayEntry.day.weekDayName,
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