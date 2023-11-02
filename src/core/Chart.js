import React, {useEffect, useRef, useState} from "react";

import Chart from 'chart.js/auto';
import 'chartjs-adapter-spacetime';

import {DefaultChartConfig, Service as ChartUtil} from '../config/global-chart-config'
import {Service as BalanceService} from './Statistical'
import {LocalizationService} from './localization'
import PropTypes from "prop-types";
import {Charts, Statistical} from "./index";
import {EntityShapes} from "../config";
import {Loading} from "./layout";
import {isArray} from "chart.js/helpers";

const defaultGraphColors = [
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

const BalanceChart = ({id, range, allMoney, accounts}) => {
    const [balanceSeries, setBalanceSeries] = useState(undefined)
    useEffect(() => {
        const actualAccounts = Array.isArray(accounts) ? accounts : [accounts]

        setBalanceSeries(undefined)
        provider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: allMoney,
            accounts: actualAccounts
        }).then(result => setBalanceSeries([result]))
    }, [range, allMoney, accounts])

    return (
        <Loading condition={balanceSeries !== undefined}>
            <Charts.Chart height={350}
                          id={id}
                          dataSets={balanceSeries || []}>
            </Charts.Chart>
        </Loading>
    )
}
BalanceChart.propTypes = {
    id: PropTypes.string.isRequired,
    range: PropTypes.any,
    accounts: PropTypes.oneOfType([PropTypes.array, EntityShapes.Account]),
    allMoney: PropTypes.bool,
}

const CategorizedPieChart = ({id, range, split, incomeOnly, accounts}) => {
    const [pieSeries, setPieSeries] = useState(undefined)

    useEffect(() => {
        const command = {
            dateRange: {
                start: range.startString(),
                end: range.endString()
            },
            onlyIncome: incomeOnly
        }
        if (Array.isArray(accounts)) command.accounts = accounts
        else if (accounts) command.accounts = [accounts]

        Statistical.Service.split(split, command)
            .then(series => series.filter(point => point.balance !== 0))
            .then(setPieSeries)
    }, [range, split, incomeOnly, accounts])

    return (
        <Loading condition={pieSeries}>
            <Charts.Chart id={id}
                          type='pie'
                          height={300}
                          labels={(pieSeries || []).map(point => point.partition)}
                          dataSets={[{
                              data: (pieSeries || []).map(point => point.balance)
                          }]}
                          options={{
                              elements: {
                                  arc: {
                                      backgroundColor: context => defaultGraphColors[context.dataIndex]
                                  }
                              },
                              plugins: {
                                  legend: {
                                      display: true,
                                      position: 'right'
                                  },
                                  tooltip: {
                                        callbacks: {
                                            title: (context) => pieSeries[context[0].dataIndex]?.partition,
                                            label: (context) => {
                                                if (accounts && !isArray(accounts)) {
                                                    const point = pieSeries[context.dataIndex]
                                                    return `${point.balance} ${accounts?.account.currency}`
                                                }
                                            }
                                        }
                                  }
                              },
                              maintainAspectRatio: false
                          }}/>
        </Loading>
    )
}
CategorizedPieChart.propTypes = {
    range: PropTypes.shape({}),
    split: PropTypes.oneOf(['account', 'category', 'budget']),
    accounts: PropTypes.oneOfType([PropTypes.array, EntityShapes.Account])
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
    BalanceChart,
    CategorizedPieChart,
    provider as SeriesProvider
}
