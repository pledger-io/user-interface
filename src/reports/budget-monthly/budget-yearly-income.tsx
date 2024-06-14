import React, { useEffect, useState } from "react";
import { Dates, Layout, Statistical, Translations } from "../../core";
import { Budget } from "../../core/types";
import { ChartData } from "chart.js";
import BudgetChart from "./budget-chart";

type BudgetYearlyExpenseProps = {
    year: number,
    budgets: Budget[],
    currencySymbol: string
}

const YearlyIncomeGraphComponent = ({ year = 1970, budgets = [], currencySymbol = '' } : BudgetYearlyExpenseProps) => {
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
            { chartData && <BudgetChart dataSet={ chartData } currencySymbol={ currencySymbol } /> }
        </Layout.Card>
    </>
}

export default YearlyIncomeGraphComponent
