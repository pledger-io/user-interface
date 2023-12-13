import React, { useEffect, useState } from "react";
import { Dates, Layout, Statistical, Translations } from "../../core";
import { ChartData } from "chart.js";
import { Range } from "../../core/Dates";
import { ChartDataset } from "chart.js/dist/types";
import { Category } from "../../core/types";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../config/global-chart-config";

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
            Promise.all(months.map(m =>
                Statistical.Service.balance({
                    dateRange: {
                        start: m.startString(),
                        end: m.endString()
                    },
                    onlyIncome: true,
                    categories: categories
                })))
                .then(async income => {
                    resolve([{
                        label: await Translations.LocalizationService.get('graph.series.income'),
                        backgroundColor: '#7fc6a5',
                        data: income.map(({ balance }) => balance)
                    }])
                })
                .catch(fail)
        )
        const expensePromise = new Promise<ChartDataset[]>((resolve, fail) =>
            Promise.all(months.map(m => Statistical.Service.balance({
                dateRange: {
                    start: m.startString(),
                    end: m.endString()
                },
                onlyIncome: false,
                categories: categories
            })))
                .then(async responses => {
                    resolve([{
                        label: await Translations.LocalizationService.get('graph.series.expenses'),
                        backgroundColor: '#dc3545',
                        data: responses.map(({ balance }) => balance)
                    }])
                })
                .catch(fail)
        )

        Promise.all([incomePromise, expensePromise])
            .then(([income, expense]) => {
                setChartData({
                    labels: months.map(m => m.start),
                    datasets: [...income, ...expense]
                })
            })
    }, [categories, months])

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
