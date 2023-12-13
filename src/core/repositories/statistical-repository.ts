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

const StatisticalRepository = (api => {
    return {
        balance: (filter: BalanceRequestFilter): Promise<Balance>                              => api.post('statistics/balance', filter),
        daily: (filter: BalanceRequestFilter)                                                  => api.post('statistics/balance/daily', filter),
        split: (splitBy: string, filter: BalanceRequestFilter): Promise<BalancePartition[]>    => api.post(`statistics/balance/partitioned/${encodeURI(splitBy)}`, filter)
    }
})(RestApi)

export default StatisticalRepository