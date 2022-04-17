import React, {useEffect, useRef} from "react";

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';

import {DefaultChartConfig, Service as ChartUtil} from '../config/global-chart-config'
import {Service as BalanceService} from './Statistical'
import {LocalizationService} from './Translation'

function ChartComponent({id, height = 50, children, type = 'line', options = {}, dataSets = [], labels = [], ...props}) {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    const render = () => {
        if (canvasRef.current && !chartRef.current) {
            chartRef.current = new Chart(canvasRef.current, {
                type: type,
                options: ChartUtil.mergeOptions(options, DefaultChartConfig[type])
            })

            window.addEventListener('resize', redraw)
        }
    }
    const redraw = () => {
        chartRef.current.update()
    }
    const destroy = () => {
        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
            window.removeEventListener('resize', redraw)
        }
    }

    useEffect(() => {
        render()
        return () => destroy()
    }, [])

    useEffect(() => {
        if (dataSets && dataSets.length > 0 && chartRef.current !== null) {
            chartRef.current.data.datasets = dataSets
            chartRef.current.update()
        }
    }, [dataSets])

    useEffect(() => {
        if (labels.length > 0 && chartRef.current !== null) {
            chartRef.current.data.labels = labels
            chartRef.current.update()
        }
    }, [labels])

    return (
        <div className='Chart'>
            <canvas ref={canvasRef} id={id} height={height} {...props} />
        </div>
    )
}

class ChartSeriesProvider {
    async balanceSeries({id, title, accounts = [], categories = [], contracts = [], expenses = [], onlyIncome, allMoney, currency, dateRange = {}}) {
        const dataSearchCommand = {
            accounts: accounts,
            categories: categories,
            contracts: contracts,
            expenses: expenses,
            onlyIncome: onlyIncome,
            allMoney: allMoney,
            currency: currency,
            dateRange: {
                start: dateRange.startString(),
                end: dateRange.endString()
            }
        }

        const seriesData = []
        const startBalance = await BalanceService.balance({...dataSearchCommand, dateRange: {start: '1970-01-01', end: dateRange.startString()}})
        const dailyBalance = await BalanceService.daily(dataSearchCommand)
        const endBalance = await BalanceService.balance({...dataSearchCommand, dateRange: {start: '1970-01-01', end: dateRange.endString()}})

        if (dailyBalance.length === 0 || dailyBalance[0].date !== dateRange.startString()) {
            seriesData.push({x: dateRange.startString(), y: startBalance.balance})
        }

        let balance = startBalance.balance
        for (let idx = 0; idx < dailyBalance.length; idx++) {
            balance += dailyBalance[idx].amount
            seriesData.push({x: dailyBalance[idx].date, y: balance})
        }
        seriesData.push({x: dateRange.endString(), y: endBalance.balance})

        return {
            label: await LocalizationService.get(title),
            data: seriesData,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            borderColor: 'green'
        }
    }
}
const provider = new ChartSeriesProvider()

export {
    ChartComponent as Chart,
    provider as SeriesProvider
}
