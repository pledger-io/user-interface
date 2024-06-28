import React, { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Account } from "../../core/types";
import { BalanceSeries } from "../graphs/balance-series";
import { Range } from "../../core/Dates";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../config/global-chart-config";
import { CurrencyRepository } from "../../core/RestAPI";

import Loading from "../layout/loading.component";

type LiabilityGraphProps = {
    range: Range,
    account: Account
}

function LiabilityGraph(props: LiabilityGraphProps) {
    const [balanceSeries, setBalanceSeries] = useState<ChartData | undefined>(undefined)
    const { range, account } = props

    useEffect(() => {
        if (account && range) {
            BalanceSeries({
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: true,
                accounts: [account]
            }).then(result => setBalanceSeries({
                datasets: [ result ]
            }))
        }
    }, [range, account])

    const currencySymbol = CurrencyRepository.cached(account.account.currency)?.symbol
    if (!balanceSeries) return <Loading />
    return <>
        <Chart height={ 100 }
               type={ 'line' }
               id='liability-balance-graph'
               options={ Service.mergeOptions({
                   scales: {
                       y: {
                           reverse: true,
                           ticks: {
                               callback: (value: any) => `${currencySymbol}${value}`
                           }
                       }
                   },
                   maintainAspectRatio: true
               }, DefaultChartConfig.line) }
               data={ balanceSeries } />
    </>
}

export default LiabilityGraph