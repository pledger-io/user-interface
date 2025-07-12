import RestApi from "./rest-api";
import { Balance, Identifiable, SpendingInsight, SpendingPattern } from "../../types/types";

export type BalanceRequestFilter = {
    onlyIncome: boolean,
    dateRange: {
        start: string,
        end: string
    }
    allMoney?: boolean,
    currency?: string,
    accounts?: Identifiable[],
    categories?: Identifiable[],
    contracts?: Identifiable[],
    expenses?: Identifiable[]
    importSlug?: string
}

type BalancePartition = Balance & {
    partition: string
}
type DateBalance = {
    date: string,
    amount: number
}

const StatisticalRepository = (api => {
    return {
        balance: (filter: BalanceRequestFilter): Promise<Balance>                              => api.post('statistics/balance', filter),
        daily: (filter: BalanceRequestFilter): Promise<DateBalance[]>                          => api.post('statistics/balance/daily', filter),
        monthly: (filter: BalanceRequestFilter): Promise<DateBalance[]>                        => api.post('statistics/balance/monthly', filter),
        split: (splitBy: string, filter: BalanceRequestFilter): Promise<BalancePartition[]>    => api.post(`statistics/balance/partitioned/${encodeURI(splitBy)}`, filter),
        insights: (year: number, month: number): Promise<SpendingInsight[]>                    => api.get(`statistics/spending/insights?year=${ year }&month=${ month }`),
        patterns: (year: number, month: number): Promise<SpendingPattern[]>                    => api.get(`statistics/spending/patterns?year=${ year }&month=${ month }`)
    }
})(RestApi)

export default StatisticalRepository