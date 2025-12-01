import RestApi from "./rest-api";
import { Balance, Identifier, SpendingInsight, SpendingPattern } from "../../types/types";

export type BalanceRequestFilter = {
    range: {
        startDate: string,
        endDate: string
    }
    allMoney?: boolean,
    currency?: string,
    accounts?: Identifier[],
    categories?:  Identifier[],
    contracts?:  Identifier[],
    expenses?:  Identifier[]
    importSlug?: string
    type: 'INCOME' | 'EXPENSE' | 'ALL'
}

type BalancePartition = Balance & {
    partition: string
}
export type DateBalance = {
    date: string,
    balance: number
}

const StatisticalRepository = (api => {
    return {
        balance: (filter: BalanceRequestFilter): Promise<Balance>                              => api.post('balance', filter),
        daily: (filter: BalanceRequestFilter): Promise<DateBalance[]>                          => api.post('balance/by-date/daily', filter),
        monthly: (filter: BalanceRequestFilter): Promise<DateBalance[]>                        => api.post('balance/by-date/monthly', filter),
        split: (splitBy: string, filter: BalanceRequestFilter): Promise<BalancePartition[]>    => api.post(`balance/${encodeURI(splitBy)}`, filter),
        insights: (year: number, month: number): Promise<SpendingInsight[]>                    => api.get(`detected/insight?year=${ year }&month=${ month }`),
        patterns: (year: number, month: number): Promise<SpendingPattern[]>                    => api.get(`detected/pattern?year=${ year }&month=${ month }`)
    }
})(RestApi)

export default StatisticalRepository