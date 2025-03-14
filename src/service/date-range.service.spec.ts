import DateRangeService from "./date-range.service";
import { vi } from "vitest";

describe('Ranges', () => {
  beforeEach(() => {
    vi.useFakeTimers()
      .setSystemTime(new Date('2010-01-03'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("Get correct range for current month.", () => {
    const currentMonth = DateRangeService.currentMonth()

    expect(currentMonth.startString()).toEqual('2010-01-01')
    expect(currentMonth.endString()).toEqual('2010-02-01')
  })

  it("Get correct range for current year.", () => {
    const range = DateRangeService.currentYear()
    expect(range.startString()).toEqual('2010-01-01')
    expect(range.endString()).toEqual('2010-12-31')
  })

  it("Get correct range for given period.", () => {
    const range = DateRangeService.forRange("2012-02-02", "2013-02-20")
    expect(range.startString()).toEqual('2012-02-02')
    expect(range.endString()).toEqual('2013-02-20')
  })

  it("Get the previous 30 days.", () => {
    const range = DateRangeService.previousDays(30)
    expect(range.startString()).toEqual('2009-12-04')
    expect(range.endString()).toEqual('2010-01-03')
  })
})
