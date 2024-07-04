import DateRange from "../types/date-range.type";

const ONE_DAY = 86400000;

const _ = (() => {
    return {
        previousDays: (days: number, from = new Date()) => {
            return new DateRange(new Date(from.getTime() - (ONE_DAY * days)), from)
        },
        currentMonth: () => {
            const now = new Date()
            return _.forMonth(now.getFullYear(), now.getMonth() + 1)
        },
        currentYear: () => {
            const now = new Date()
            return _.forYear(now.getFullYear())
        },
        forMonth: (year: number, month: number) => {
            return new DateRange(new Date(Date.UTC(year, month - 1, 1)), new Date(Date.UTC(year, month, 1)))
        },
        forYear: (year: number) => {
            return new DateRange(new Date(Date.UTC(year, 0, 1)), new Date(Date.UTC(year, 11, 31)))
        },
        forRange: (start: string, end: string) => {
            const parsedStart = new Date(start)
            let parsedEnd = new Date(end)

            if (parsedStart.getDate() === parsedEnd.getDate()) {
                parsedEnd = new Date(parsedEnd.setDate(parsedEnd.getDate() + 1))
            }

            return new DateRange(parsedStart, parsedEnd)
        },
        // Return a list of monthly ranges for the given year
        months: (year: number): DateRange[] => {
            return [...new Array(12).keys()]
                .map(month => _.forMonth(year, month + 1))
        }
    }
})()

export default _