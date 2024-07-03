import { Identifiable } from "../../core/types";
import { Range } from "../../core/Dates";

export type BalanceSeriesFilter = {
    title: string,
    dateRange: Range
    onlyIncome?: boolean,
    allMoney?: boolean,
    accounts?: Identifiable[],
    categories?: Identifiable[],
    contracts?: Identifiable[],
    expenses?: Identifiable[],
    currency?: string
}