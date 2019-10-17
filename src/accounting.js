"use strict";

module.exports = class Accounting {
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
