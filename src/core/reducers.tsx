import {Transaction} from "./types";

export type YearlyTransactions = {
    [year: string]: Transaction[]
}

export const groupTransactionByYear = (accumulator: YearlyTransactions, transaction: Transaction) : YearlyTransactions => {
    const year = `${new Date(transaction.dates.transaction).getFullYear()}`
    accumulator[year] = [...(accumulator[year] || []), transaction]
    return accumulator
}

export type DailyTransactions = {
    [day: string]: Transaction[]
}

export const groupTransactionByDay = (accumulator: DailyTransactions, transaction: Transaction) : DailyTransactions => {
    accumulator[transaction.dates.transaction] = [...(accumulator[transaction.dates.transaction] || []), transaction]
    return accumulator
}