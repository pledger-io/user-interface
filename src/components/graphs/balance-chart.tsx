import React, { FC, useEffect, useState } from "react";
import { Account } from "../../types/types";
import useDateRange from "../../hooks/date-range.hook";
import { BalanceSeries } from "./balance-series";
import { Chart } from "react-chartjs-2";
import { ChartData } from "chart.js";
import { DefaultChartConfig, Service } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";
import { CurrencyRepository } from "../../core/RestAPI";
import { isArray } from "chart.js/helpers";

import Loading from "../layout/loading.component";

type BalanceChartProps = {
    id: string
    allMoney: boolean
    accounts: Account | Account[] | undefined,
    height?: number
}

const BalanceChart: FC<BalanceChartProps> = ({ id, allMoney, accounts, height = 350 }) => {
    const [balanceSeries, setBalanceSeries] = useState<ChartData | undefined>(undefined)
    const [range] = useDateRange()

    useEffect(() => {
        if (range) {
            setBalanceSeries(undefined)
            BalanceSeries(
                {
                    title: 'graph.series.balance',
                    dateRange: range,
                    allMoney: allMoney,
                    accounts: accounts ? (Array.isArray(accounts) ? accounts : [accounts]) : undefined
                })
                .then((result) => setBalanceSeries({
                    datasets: [result]
                }))
        }
    }, [range, allMoney, accounts]);

    let currencySymbol = (RestAPI.user() as any).defaultCurrency?.symbol
    if (!isArray(accounts) && accounts)
        currencySymbol = CurrencyRepository.cached(accounts.account.currency).symbol

    if (!balanceSeries) return <Loading />
    return <>
        <Chart height={ height }
               type={ 'line' }
               id={ id }
               options={ Service.mergeOptions({
                   scales: {
                       y: {
                           ticks: {
                               callback: (value: any) => `${currencySymbol}${value}`
                           }
                       }
                   }

               }, DefaultChartConfig.line) }
               data={ balanceSeries } />
    </>
}

export default BalanceChart