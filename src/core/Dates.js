const ONE_DAY = 86400000;

class Range {
    constructor(start = undefined, end = undefined) {
        this.start = start
        this.end = end
    }

    startString() {
        return this.start?.toISOString().substring(0, 10)
    }

    endString() {
        return this.end?.toISOString().substring(0, 10)
    }

    month() {
        return this.start?.getMonth() + 1
    }

    year() {
        return this.start?.getFullYear()
    }

    // Translate this range to a range x days before this one
    before(days) {
        const begin = new Date(this.start.getTime() - (ONE_DAY * days))
        return new Range(begin, this.start)
    }
}

class RangeService {
    previousDays(days, from = new Date()) {
        const begin = new Date(from.getTime() - (ONE_DAY * days))
        return new Range(begin, from);
    }

    forMonth(year, month) {
        const begin = new Date(Date.UTC(year, month - 1, 1));
        const end = new Date(Date.UTC(year, month, 1));
        return new Range(begin, end)
    }

    forYear(year) {
        const begin = new Date(Date.UTC(year, 1, 1))
        const end = new Date(Date.UTC(year, 12, 31))
        return new Range(begin, end)
    }

    forRange(start, end) {
        const parsedStart = new Date(start)
        let parsedEnd = new Date(end)

        if (parsedStart.getDate() === parsedEnd.getDate()) {
            parsedEnd = new Date(parsedEnd.setDate(parsedEnd.getDate() + 1))
        }

        return new Range(parsedStart, parsedEnd)
    }
}
const service = new RangeService()

export {
    Range,
    service as Ranges
}
