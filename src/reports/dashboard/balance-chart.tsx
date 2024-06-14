import { Layout } from "../../core";
import React, { useEffect, useState } from "react";
import { Range } from "../../core/Dates";
import { BalanceSeries } from "../../core/graphs/balance-series";
import { ChartData } from "chart.js";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import RestAPI from "../../core/repositories/rest-api";

const BalanceChart = ({ range } : { range: Range }) => {
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

    const config = ChartService.mergeOptions(
        DefaultChartConfig.line,
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value: number) => {
                            return `${(RestAPI.user() as any).defaultCurrency?.symbol}${value.toFixed(2)}`
                        }
                    }
                }
            }
        }
    )

    return <>
        <Layout.Card title='page.dashboard.accounts.balance'>
            { !balanceSeries && <Layout.Loading /> }

            { balanceSeries && <div className='relative h-[25em]'>
                <Chart type='line'
                       id='dashboard-balance-graph'
                       options={ config }
                       data={ balanceSeries } /></div>
            }
        </Layout.Card>
    </>
}

export default BalanceChart