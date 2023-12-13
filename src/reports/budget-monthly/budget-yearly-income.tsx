import React, { useEffect, useState } from "react";
import { Dates, Layout, Statistical, Translations } from "../../core";
import { Budget } from "../../core/types";
import { ChartData } from "chart.js";
import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../config/global-chart-config";

type BudgetYearlyExpenseProps = {
    year: number,
    budgets: Budget[]
}

const YearlyIncomeGraphComponent = ({ year = 1970, budgets = [] } : BudgetYearlyExpenseProps) => {
    const [chartData, setChartData] = useState<ChartData | undefined>()

    useEffect(() => {
        if (budgets.length === 0) return

        Promise.all(Dates.Ranges.months(year)
                .map(m => Statistical.Service.balance({
                    dateRange: m.toBackend(),
                    onlyIncome: true
                })))
            .then(async data => {
                setChartData({
                    labels: Dates.Ranges.months(year).map(m => m.start),
                    datasets: [
                        {
                            label: await Translations.LocalizationService.get('graph.series.budget.expected'),
                            data: budgets.map(({ income }) => income),
                            borderColor: '#f0c77c',
                            backgroundColor: '#f0c77c'
                        },
                        {
                            data: data.map(({ balance }) => balance),
                            label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                            borderColor: '#6996b2',
                            backgroundColor: '#6996b2'
                        }
                    ]
                })
            })
            .catch(console.error)
    }, [year, budgets]);

    return <>
        <Layout.Card title='page.reports.budget.incomePercent'>
            { !chartData && <Layout.Loading /> }
            { chartData && <>
                <Chart type='line'
                       height={ 300 }
                       options={ Service.mergeOptions(DefaultChartConfig.line,{
                           scales: {
                               x: {
                                   time: {
                                       unit: 'month'
                                   }
                               }
                           },
                           plugins: {
                               legend: {
                                   display: true
                               }
                           }
                       }) }
                       data={ chartData } />
            </> }
        </Layout.Card>
    </>
}

export default YearlyIncomeGraphComponent
