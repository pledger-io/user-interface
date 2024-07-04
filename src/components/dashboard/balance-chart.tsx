import React, { useEffect, useState } from "react";

import { Chart } from "react-chartjs-2";
import { ChartData } from "chart.js";

import DateRange from "../../types/date-range.type";
import { BalanceSeries } from "../graphs/balance-series";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";

import Card from "../layout/card.component";
import Loading from "../layout/loading.component";

const BalanceChart = ({ range } : { range: DateRange }) => {
    const [balanceSeries, setBalanceSeries] = useState<ChartData | undefined>()

    useEffect(() => {
        BalanceSeries({
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true
        }).then(result => setBalanceSeries({
            datasets: [ result ]
        }))
    }, [range])

    return <Card title='page.dashboard.accounts.balance'>
        { !balanceSeries && <Loading/> }

        { balanceSeries && <div className='relative h-[25em]'>
            <Chart type='line'
                   id='dashboard-balance-graph'
                   options={ ChartService.mergeOptions(
                       DefaultChartConfig.line,
                       {
                           scales: {
                               y: {
                                   ticks: {
                                       callback: (value: number) => {
                                           return `${ (RestAPI.user() as any).defaultCurrency?.symbol }${ value.toFixed(2) }`
                                       }
                                   }
                               }
                           }
                       }
                   ) }
                   data={ balanceSeries }/></div>
        }
    </Card>
}

export default BalanceChart