import React, { useEffect, useState } from "react";

import { Chart } from "react-chartjs-2";
import { ChartData } from "chart.js";

import DateRange from "../../types/date-range.type";
import { BalanceSeries } from "../graphs/balance-series";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";
import Loading from "../layout/loading.component";
import { Panel } from "primereact/panel";
import { i10n } from "../../config/prime-locale";

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

    return <Panel header={ i10n(`page.dashboard.accounts.balance`) }>
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
                           },
                           plugins: {
                               tooltip: {
                                   callbacks: {
                                       title: (context: any) => {
                                           return context[0].dataset.label + ': ' + new Intl.DateTimeFormat(localStorage.getItem('language') || 'en')
                                               .format(context[0].parsed.x)
                                       },
                                       label: (context: any) => {
                                           const value = context.parsed.y.toFixed(2)
                                           return `${ (RestAPI.user() as any).defaultCurrency?.symbol }${ value }`
                                       }
                                   }
                               }
                           }
                       }
                   ) }
                   data={ balanceSeries }/></div>
        }
    </Panel>
}

export default BalanceChart