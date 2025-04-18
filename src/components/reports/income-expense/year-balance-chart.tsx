import DateRange from "../../../types/date-range.type";
import { useEffect, useState } from "react";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { ChartDataset } from "chart.js/dist/types";
import { ChartData } from "chart.js";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../../config/global-chart-config";
import DateRangeService from "../../../service/date-range.service";

import Loading from "../../layout/loading.component";
import { i10n } from "../../../config/prime-locale";

type YearBalanceChartProps = {
    year: number,
    currencySymbol: string,
    currency: string
}

const YearBalanceChart = ({ year, currencySymbol, currency } : YearBalanceChartProps) => {
    const [months, setMonths] = useState<DateRange[]>()
    const [chartData, setChartData] = useState<ChartData>()

    useEffect(() => {
        const yearMonths = DateRangeService.months(year)
        const additionalMonths = [...Array(4).keys()]
            .map(x => 12 - 4 + x + 1)
            .map(month => DateRangeService.forMonth(year - 1, month))

        setMonths([...additionalMonths, ...yearMonths])
    }, [year]);

    useEffect(() => {
        if (!months) return

        const incomePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            Promise.all(months.map(month =>
                StatisticalRepository.balance({
                    dateRange: month.toBackend(),
                    currency,
                    onlyIncome: true
                })))
                .then(income => {
                    const incomeLabel = i10n('graph.series.income')
                    const rollingAverageLabel = i10n('graph.series.income.sma')
                    resolve([
                        {
                            label: incomeLabel,
                            data: income.filter((x, idx) => idx >= 4)
                                .map(balance => balance.balance),
                            backgroundColor: '#7fc6a5'
                        },
                        {
                            label: rollingAverageLabel,
                            type: 'line',
                            borderColor: 'black',
                            borderDash: [10, 10],
                            data: income.filter((b, idx) => idx < (income.length - 4))
                                .map((balance, idx) => {
                                    let expected = 0
                                    for (let counter = 0; counter < 4; counter++) {
                                        expected += income[idx + counter].balance
                                    }
                                    return expected / 4
                                })
                        }
                    ])
                })
                .catch(fail))
        const expensePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            Promise.all(months.map(month =>
                StatisticalRepository.balance({
                    dateRange: month.toBackend(),
                    currency,
                    onlyIncome: false
                })))
                .then(expense => {
                    const expenseLabel = i10n('graph.series.expenses')
                    const rollingAverageLabel = i10n('graph.series.expenses.sma')

                    resolve([
                        {
                            label: expenseLabel,
                            data: expense.filter((x, idx) => idx >= 4)
                                .map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#dc3545',
                        },
                        {
                            label: rollingAverageLabel,
                            type: 'line',
                            borderColor: '#9abdd2',
                            borderDash: [10, 10],
                            data: expense.filter((b, idx) => idx < (expense.length - 4))
                                .map((balance, idx) => {
                                    let expected = 0
                                    for (let counter = 0; counter < 4; counter++) {
                                        expected += expense[idx + counter].balance
                                    }
                                    return Math.abs(expected / 4)
                                })
                        }
                    ])
                })
                .catch(fail))

        Promise.all([incomePromise, expensePromise])
            .then(([income, expense]) => {
                setChartData({
                    labels: months.filter((x, idx) => idx >= 4)
                        .map(month => month.startDate()),
                    datasets: [...income, ...expense]
                })
            })
            .catch(console.error)
    }, [months, currency]);

    if (!chartData) return <Loading />
    return <>
        <Chart type='bar'
               id='income-expense-graph'
               data={ chartData }
               height={ 400 }
               options={ Service.mergeOptions(DefaultChartConfig.bar, {
                   scales: {
                       x: {
                           type: 'time',
                           time: {
                               unit: 'month'
                           }
                       },
                       y: {
                           ticks: {
                               callback: (value: any) => `${currencySymbol}${value}`
                           }
                       }
                   },
                   plugins: {
                       tooltip: {
                           mode: 'point',
                           callbacks: {
                               title: (context: any) => {
                                   const date = new Date(context[0].parsed.x)
                                   return date.toLocaleString(localStorage.getItem('language') || 'en', { month: 'long' })
                               },
                               label: (context: any) => {
                                   const value = context.parsed.y.toFixed(2)
                                   return `${context.dataset.label}: ${currencySymbol}${value}`
                               }
                           }
                       },
                       legend: {
                           position: 'bottom',
                           display: true
                       }
                   }
               }) }/>
    </>
}

export default YearBalanceChart
