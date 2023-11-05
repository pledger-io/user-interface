import React, {useEffect, useRef} from "react";

import Chart from 'chart.js/auto';
import 'chartjs-adapter-spacetime';

import {DefaultChartConfig, Service as ChartUtil} from '../config/global-chart-config'
import {Service as BalanceService} from './Statistical'
import {LocalizationService} from './localization'
import PropTypes from "prop-types";

export const defaultGraphColors = [
    '#E0FFFF',
    '#00CED1',
    '#40E0D0',
    '#48D1CC',
    '#AFEEEE',
    '#7FFFD4',
    '#B0E0E6',
    '#5F9EA0',
    '#66CDAA',
    '#3CB371',
    '#20B2AA',
    '#2F4F4F',
    '#008080',
    '#008B8B',
    '#32CD32',
    '#90EE90',
    '#ADFF2F',
    '#90EE90',
    '#ADFF2F',
    '#7FFF00',
    '#7FFF00',
    '#6B8E23',
]

const ChartComponent = ({id, height = 50, type = 'line', options = {}, dataSets = [], labels = [], ...props}) => {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        const resize = () => chartRef.current.update()
        if (canvasRef.current && !chartRef.current) {
            chartRef.current = new Chart(canvasRef.current, {
                type: type,
                options: ChartUtil.mergeOptions(options, DefaultChartConfig[type])
            })
        }
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }
    }, [chartRef]) // eslint-disable-line react-hooks/exhaustive-deps

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
ChartComponent.propTypes = {
    // The unique identifier of the chart
    id: PropTypes.string.isRequired,
    // The height of the chart, defaults to 50
    height: PropTypes.number,
    // The default type of any series in the chart
    type: PropTypes.oneOf(['line', 'bar', 'pie'])
}

class ChartSeriesProvider {
    async balanceSeries({ title = '',
                          accounts = [],
                          categories = [],
                            contracts = [],
                            expenses = [],
                            onlyIncome = false,
                            allMoney = true,
                            currency = undefined,
                            dateRange = {}}) {
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
