import DateRange from "./date-range.type"

describe(DateRange, () => {
    const range = new DateRange(new Date('2010-02-01'), new Date('2010-03-01'))

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