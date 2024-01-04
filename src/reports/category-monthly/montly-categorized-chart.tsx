import React, { useEffect, useState } from "react";
import { Dates, Layout, Translations } from "../../core";
import { ChartData } from "chart.js";
import { Range } from "../../core/Dates";
import { ChartDataset } from "chart.js/dist/types";
import { Category } from "../../core/types";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../config/global-chart-config";
import StatisticalRepository from "../../core/repositories/statistical-repository";

type CategoryGraphProps = {
    categories: Category[],
    year: number,
    currencySymbol: string
}

const CategoryGraph = ({ categories, year, currencySymbol }: CategoryGraphProps) => {
    const [chartData, setChartData] = useState<ChartData>()
    const [months, setMonths] = useState<Range[]>()

    useEffect(() => {
        setMonths(Dates.Ranges.months(year))
    }, [year]);

    useEffect(() => {
        if (!months) return

        const incomePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            StatisticalRepository.monthly({
                dateRange: Dates.Ranges.forYear(year).toBackend(),
                onlyIncome: true,
                categories: categories
            })
                .then(async income => {
                    resolve([{
                        label: await Translations.LocalizationService.get('graph.series.income'),
                        backgroundColor: '#7fc6a5',
                        // @ts-ignore
                        data: income.map(({ date, amount }) => ({ x: date, y: amount }))
                }])
            })
                .catch(fail)
        )
        const expensePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            StatisticalRepository.monthly({
                dateRange: Dates.Ranges.forYear(year).toBackend(),
                onlyIncome: false,
                categories: categories
            })
                .then(async income => {
                    resolve([{
                        label: await Translations.LocalizationService.get('graph.series.expenses'),
                        backgroundColor: '#dc3545',
                        // @ts-ignore
                        data: income.map(({ date, amount }) => ({ x: date, y: Math.abs(amount) }))
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
    }, [categories, year]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!chartData) return <Layout.Loading />
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
                   }
               }) }/>
    )
}

export default CategoryGraph
