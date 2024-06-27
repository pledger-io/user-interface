import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Range } from "../../core/Dates";
import { ChartData } from "chart.js";
import { Budget, BudgetExpense } from "../../core/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import BudgetRepository from "../../core/repositories/budget.repository";
import RestAPI from "../../core/repositories/rest-api";

import LocalizationService from "../../service/localization.service";

import Loading from "../layout/loading.component";
import Card from "../layout/card.component";

const percentageOfYear = 90 / 365

function BudgetBalance({ range } : { range : Range }) {
    const [budgetSeries, setBudgetSeries] = useState<ChartData | undefined | null>()

    useEffect(() => {
        BudgetRepository.budgetMonth(range.year(), range.month())
            .then(async (budget: Budget) => {
                const expenses = budget.expenses

                setBudgetSeries({
                    labels: expenses.map(({ name }) => name),
                    datasets: [
                        {
                            label: await LocalizationService.get('graph.series.budget.expected'),
                            data: expenses.map(expense => expense.expected * 12 * percentageOfYear),
                            backgroundColor: '#9abdd2'
                        },
                        {
                            label: await LocalizationService.get('graph.series.budget.actual'),
                            data: (await Promise.all(
                                expenses.map((expense : BudgetExpense) =>
                                    StatisticalRepository.balance({
                                        dateRange: range.toBackend(),
                                        onlyIncome: false,
                                        expenses: [{ id: expense.id }]
                                    })))).map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#7fc6a5'
                        }
                    ]
                })
            })
            .catch(_ => setBudgetSeries({ labels: [], datasets: [] }))
    }, [range])

    const config = ChartService.mergeOptions(
        DefaultChartConfig.bar,
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value: number) => {
                            return `${(RestAPI.user() as any).defaultCurrency?.symbol}${value.toFixed(2)}`
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true
                }
            }
        }
    )

    return <>
        <Card title='page.dashboard.budgets.balance'>
            { !budgetSeries && <Loading /> }
            { budgetSeries &&
                <Chart type='bar'
                       id='dashboard-budgets-graph'
                       height={ 300 }
                       options={ config }
                       data={ budgetSeries } />
            }
        </Card>
    </>
}

export default BudgetBalance