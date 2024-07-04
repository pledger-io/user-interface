import React, { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Budget, BudgetExpense } from "../../../core/types";
import StatisticalRepository from "../../../core/repositories/statistical-repository";
import DateRangeService from "../../../service/date-range.service";

import LocalizationService from "../../../service/localization.service";

import BudgetChart from "./chart.component";
import Card from "../../layout/card.component";
import Loading from "../../layout/loading.component";

type BudgetYearlyExpenseProps = {
    year: number,
    budgets: Budget[],
    currencySymbol: string
}

const BudgetYearlyExpense = ({ year, budgets, currencySymbol } : BudgetYearlyExpenseProps) => {
    const [chartData, setChartData] = useState<ChartData | undefined>()

    useEffect(() => {
        if (budgets.length === 0) return
        setChartData(undefined)

        const uniqueExpenses = budgets.reduce((left, right) => [...left, ...right.expenses], new Array<BudgetExpense>())
            .map(({ id }) => id)
            .filter((value, index, self) => self.indexOf(value) === index)

        Promise.all(DateRangeService.months(year)
            .map(month => StatisticalRepository.balance({
                dateRange: month.toBackend(),
                onlyIncome: false,
                expenses: uniqueExpenses.map(id => ({ id }))
            })))
            .then(async expenses => {
                setChartData({
                    labels: DateRangeService.months(year).map(m => m.startDate()),
                    datasets: [
                        {
                            label: await LocalizationService.get('graph.series.budget.expected'),
                            data: budgets.map(({ expenses }) => expenses.reduce((total, { expected }) => total + expected, 0)),
                            borderColor: '#f0c77c',
                            backgroundColor: '#f0c77c'
                        },
                        {
                            label: await LocalizationService.get('graph.series.budget.actual'),
                            data: expenses.map(({ balance }) => Math.abs(balance)),
                            borderColor: '#de7370',
                            backgroundColor: '#de7370'
                        }
                    ]
                })
            })
            .catch(console.error)
    }, [year, budgets]);

    return <Card title='page.reports.budget.expensePercent'>
        { !chartData && <Loading/> }
        { chartData && <BudgetChart dataSet={ chartData } currencySymbol={ currencySymbol }/> }
    </Card>
}

export default BudgetYearlyExpense
