import RestApi from "./rest-api";
import { Balance, Identifiable } from "../types";

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
    expenses?: Identifiable[],
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
        split: (splitBy: string, filter: BalanceRequestFilter): Promise<BalancePartition[]>    => api.post(`statistics/balance/partitioned/${encodeURI(splitBy)}`, filter)
    }
})(RestApi)

export default StatisticalRepository