const ONE_DAY = 86400000;

class Range {
    constructor(start = undefined, end = undefined) {
        this.start = start
        this.end = end
    }

    startString() {
        return this.start.toISOString().substring(0, 10)
    }

    endString() {
        return this.end.toISOString().substring(0, 10)
    }

    month() {
        return this.start.getMonth() + 1
    }

    year() {
        return this.start.getFullYear()
    }

    // Translate this range to a range x days before this one
    before(days) {
        const begin = new Date(this.start.getTime() - (ONE_DAY * days))
        return new Range(begin, this.start)
    }

    // Move the entire range up by the given number of days
    shiftDays(days) {
        const begin = new Date(this.start.getTime() + (ONE_DAY * days))
        const end = new Date(this.end.getTime() + (ONE_DAY * days))
        return new Range(begin, end)
    }

    toString() {
        return this.startString() + '_' + this.endString()
    }
}

const RangeService = (() => {
    return {
        previousDays: (days, from = new Date()) => new Range(new Date(from.getTime() - (ONE_DAY * days)), from),
        currentMonth: () => {
            const now = new Date()
            return RangeService.forMonth(now.getFullYear(), now.getMonth() + 1)
        },
        currentYear: () => {
            const now = new Date()
            return RangeService.forYear(now.getFullYear())
        },
        forMonth: (year, month) => new Range(new Date(Date.UTC(year, month - 1, 1)), new Date(Date.UTC(year, month, 1))),
        forYear: (year) => new Range(new Date(Date.UTC(year, 0, 1)), new Date(Date.UTC(year, 11, 31))),
        forRange: (start, end) => {
            const parsedStart = new Date(start)
            let parsedEnd = new Date(end)

            if (parsedStart.getDate() === parsedEnd.getDate()) {
                parsedEnd = new Date(parsedEnd.setDate(parsedEnd.getDate() + 1))
            }

            return new Range(parsedStart, parsedEnd)
        }
    }
})()

export {
    Range,
    RangeService as Ranges
}
