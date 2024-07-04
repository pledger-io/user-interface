import { Identifiable } from "../../core/types";
import DateRange from "../../types/date-range.type";

export type BalanceSeriesFilter = {
    title: string,
    dateRange: DateRange
    onlyIncome?: boolean,
    allMoney?: boolean,
    accounts?: Identifiable[],
    categories?: Identifiable[],
    contracts?: Identifiable[],
    expenses?: Identifiable[],
    currency?: string
}