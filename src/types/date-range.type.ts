const ONE_DAY = 86400000;

class DateRange {
  private readonly start: Date
  private end: Date

  constructor(start: Date, end: Date) {
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

  endMonth() {
    return this.end.getMonth() + 1
  }

  year() {
    return this.start.getFullYear()
  }

  endYear() {
    return this.end.getFullYear()
  }

  // Translate this range to a range x days before this one
  before(days: number) {
    const begin = new Date(this.start.getTime() - (ONE_DAY * days))
    return new DateRange(begin, this.start)
  }

  // Move the entire range up by the given number of days
  shiftDays(days: number) {
    const begin = new Date(this.start.getTime() + (ONE_DAY * days))
    const end = new Date(this.end.getTime() + (ONE_DAY * days))
    return new DateRange(begin, end)
  }

  toBackend() {
    return {
      start: this.startString(),
      end: this.endString()
    }
  }

  toString() {
    return this.startString() + '_' + this.endString()
  }

  startDate() {
    return this.start
  }
}

export default DateRange
