import {Layout} from "../../core";
import React, {useEffect, useState} from "react";
import {Range} from "../../core/Dates";
import {BalanceSeries} from "../../core/graphs/balance-series";
import {ChartData} from "chart.js";
import {Chart} from "react-chartjs-2";
import {DefaultChartConfig} from "../../config/global-chart-config";

const BalanceChart = ({ range } : {range: Range}) => {
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

    return <>
        <Layout.Card title='page.dashboard.accounts.balance'>
            { !balanceSeries && <Layout.Loading /> }

            { balanceSeries && <div className='relative h-[25em]'>
                <Chart type='line'
                       id='dashboard-balance-graph'
                       options={ DefaultChartConfig.line }
                       data={ balanceSeries } /></div>
            }
        </Layout.Card>
    </>
}

export default BalanceChart