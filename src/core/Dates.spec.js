import { Range, Ranges } from "./Dates";

describe('Ranges', () => {
    beforeEach(() => {
        jest.useFakeTimers()
            .setSystemTime(new Date('2010-01-03'))
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it("Get correct range for current month.", () => {
        const currentMonth = Ranges.currentMonth()

        expect(currentMonth.startString()).toEqual('2010-01-01')
        expect(currentMonth.endString()).toEqual('2010-02-01')
    })

    it("Get correct range for current year.", () => {
        const range = Ranges.currentYear()
        expect(range.startString()).toEqual('2010-01-01')
        expect(range.endString()).toEqual('2010-12-31')
    })

    it("Get correct range for given period.", () => {
        const range = Ranges.forRange("2012-02-02", "2013-02-20")
        expect(range.startString()).toEqual('2012-02-02')
        expect(range.endString()).toEqual('2013-02-20')
    })

    it("Get the previous 30 days.", () => {
        const range = Ranges.previousDays(30)
        expect(range.startString()).toEqual('2009-12-04')
        expect(range.endString()).toEqual('2010-01-03')
    })
})

describe(Range, () => {
    const range = new Range(new Date('2010-02-01'), new Date('2010-03-01'))

    it("The month should be February", () => expect(range.month()).toEqual(2))
    it("The year should be 2010", () => expect(range.year()).toEqual(2010))

    it("The previous month should be January", () => {
        const previous = range.before(31)
        expect(previous.startString()).toEqual("2010-01-01")
        expect(previous.endString()).toEqual("2010-02-01")
    })

    it("Shifting by 31 days", () => {
        const next = range.shiftDays(31)
        expect(next.startString()).toEqual("2010-03-04")
        expect(next.endString()).toEqual("2010-04-01")
    })
});
