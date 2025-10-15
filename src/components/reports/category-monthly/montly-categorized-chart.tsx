import React, { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import DateRange from "../../../types/date-range.type";
import { ChartDataset } from "chart.js/dist/types";
import { Category } from "../../../types/types";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../../config/global-chart-config";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";

import { i10n } from "../../../config/prime-locale";

import Loading from "../../layout/loading.component";

type CategoryGraphProps = {
    categories: Category[],
    year: number,
    currencySymbol: string
}

const CategoryGraph = ({ categories, year, currencySymbol }: CategoryGraphProps) => {
    const [chartData, setChartData] = useState<ChartData>()
    const [months, setMonths] = useState<DateRange[]>()

    useEffect(() => {
        setMonths(DateRangeService.months(year))
    }, [year]);

    useEffect(() => {
        if (!months) return

        const incomePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            StatisticalRepository.monthly({
                range: DateRangeService.forYear(year).toBackend(),
                type: 'INCOME',
                categories: categories.map(({ id }) => id)
            })
                .then(income => {
                    resolve([{
                        label: i10n('graph.series.income'),
                        backgroundColor: '#7fc6a5',
                        // @ts-expect-error mapping issues
                        data: income.map(({ date, balance }) => ({ x: date, y: balance }))
                }])
            })
                .catch(fail)
        )
        const expensePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            StatisticalRepository.monthly({
                range: DateRangeService.forYear(year).toBackend(),
                type: 'EXPENSE',
                categories: categories.map(({ id }) => id)
            })
                .then(income => {
                    resolve([{
                        label: i10n('graph.series.expenses'),
                        backgroundColor: '#dc3545',
                        // @ts-expect-error mapping issues
                        data: income.map(({ date, balance }) => ({ x: date, y: Math.abs(balance) }))
                    }])
                })
                .catch(fail)
        )

        Promise.all([incomePromise, expensePromise])
            .then(([income, expense]) => {
                setChartData({
                    datasets: [...income, ...expense]
                })
            })
    }, [categories, year])

    if (!chartData) return <Loading />
    return (
        <Chart height={450}
               id='category-monthly'
               type='bar'
               data={ chartData }
               options={ Service.mergeOptions(DefaultChartConfig.bar,{
                   scales: {
                       x: {
                           type: 'time',
                           time: {
                               unit: 'month'
                           }
                       },
                       y: {
                           ticks: {
                               callback: (value : any) => `${currencySymbol}${value}`
                           }
                       }
                   },
                   plugins: {
                       tooltip: {
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
                       }
                   }
               }) }/>
    )
}

export default CategoryGraph
