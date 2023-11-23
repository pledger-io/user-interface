import {BalanceSeriesFilter} from "./chart-types";
import {Balance} from "../types";
import {LocalizationService} from "../localization";
import {Range, Ranges} from "../Dates";
import StatisticalRepository from "../repositories/statistical-repository";
import {ChartDataset} from "chart.js/dist/types";

export const BalanceSeries = async (filter : BalanceSeriesFilter): Promise<ChartDataset> => {
    const label = await LocalizationService.get(filter.title)
    const adjustedFilter = {
        ...filter,
        onlyIncome: filter.onlyIncome || false,
        allMoney: filter.allMoney || true,
        dateRange: filter.dateRange.toBackend()
    } as any

    const points : {x: any, y: number}[] = []

    const startBalance = await balanceWithAdjustedRange(filter, Ranges.forRange("1970-01-01", filter.dateRange.startString()))
    const dailyBalance = await StatisticalRepository.daily(adjustedFilter)
    const endBalance = await balanceWithAdjustedRange(filter, Ranges.forRange("1970-01-01", filter.dateRange.endString()))

    // Add start only if dailyBalance does not contain start
    if (!dailyBalance.find((p: any) => p.date === filter.dateRange.startString())) {
        points.push({
            x: filter.dateRange.startString(),
            y: startBalance.balance
        })
    }

    let balance = startBalance.balance
    for (let idx = 0; idx < dailyBalance.length; idx++) {
        balance += dailyBalance[idx].amount
        points.push({x: dailyBalance[idx].date, y: balance})
    }
    points.push({x: filter.dateRange.endString(), y: endBalance.balance})

    return {
        label: label,
        data: points
    }
}

// changes the date range in the filter and calls BalanceService.balance
const balanceWithAdjustedRange = (filter: BalanceSeriesFilter, range: Range) : Promise<Balance> => {
    const adjustedFilter = {
        ...filter,
        onlyIncome: filter.onlyIncome || false,
        allMoney: filter.allMoney || true,
        dateRange: range.toBackend()
    } as any

    return StatisticalRepository.balance(adjustedFilter)
}