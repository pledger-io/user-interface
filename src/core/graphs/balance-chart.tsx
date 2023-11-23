import React, {FC, useEffect, useState} from "react";
import {Account} from "../types";
import {useDateRange} from "../hooks";
import {Loading} from "../layout";
import {BalanceSeries} from "./balance-series";
import {Chart} from "react-chartjs-2";
import {ChartData} from "chart.js";
import {DefaultChartConfig} from "../../config/global-chart-config";

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

    if (!balanceSeries) return <Loading />
    return <>
        <Chart height={ height }
               type={ 'line' }
               id={ id }
               options={ DefaultChartConfig.line }
               data={ balanceSeries } />
    </>
}

export default BalanceChart