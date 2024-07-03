import React, { useEffect, useState } from "react";
import { Dates } from "../../../core";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import { Budget } from "../../../core/types";
import { ChartData } from "chart.js";

import LocalizationService from "../../../service/localization.service";

import BudgetChart from "./chart.component";
import Card from "../../layout/card.component";
import Loading from "../../layout/loading.component";

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
                .map(m => StatisticalRepository.balance({
                    dateRange: m.toBackend(),
                    onlyIncome: true
                })))
            .then(async data => {
                setChartData({
                    labels: Dates.Ranges.months(year).map(m => m.start),
                    datasets: [
                        {
                            label: await LocalizationService.get('graph.series.budget.expected'),
                            data: budgets.map(({ income }) => income),
                            borderColor: '#f0c77c',
                            backgroundColor: '#f0c77c'
                        },
                        {
                            data: data.map(({ balance }) => balance),
                            label: await LocalizationService.get('graph.series.budget.actual'),
                            borderColor: '#6996b2',
                            backgroundColor: '#6996b2'
                        }
                    ]
                } as ChartData)
            })
            .catch(console.error)
    }, [year, budgets]);

    return <>
        <Card title='page.reports.budget.incomePercent'>
            { !chartData && <Loading /> }
            { chartData && <BudgetChart dataSet={ chartData } currencySymbol={ currencySymbol } /> }
        </Card>
    </>
}

export default YearlyIncomeGraphComponent
