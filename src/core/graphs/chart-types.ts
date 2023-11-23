import {Identifiable} from "../types";
import {Range} from "../Dates";

export type DataPoint = number | {
    x: number | string
    y: number
}

export type DataSet = {
    label: string
    data: DataPoint[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
}

export type Datasets = DataSet[] | undefined

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