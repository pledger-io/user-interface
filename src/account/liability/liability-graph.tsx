import React, { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Account } from "../../core/types";
import { BalanceSeries } from "../../core/graphs/balance-series";
import { Range } from "../../core/Dates";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig } from "../../config/global-chart-config";
import { Loading } from "../../core/layout";

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

    if (!balanceSeries) return <Loading />
    return <>
        <Chart height={ 100 }
               type={ 'line' }
               id='liability-balance-graph'
               options={ { ...DefaultChartConfig.line, maintainAspectRatio: true } }
               data={ balanceSeries } />
    </>
}

export default LiabilityGraph