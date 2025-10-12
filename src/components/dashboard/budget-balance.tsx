import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import DateRange from "../../types/date-range.type";
import { ChartData } from "chart.js";
import { Budget, BudgetExpense } from "../../types/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { DefaultChartConfig, Service as ChartService } from "../../config/global-chart-config";
import BudgetRepository from "../../core/repositories/budget.repository";
import RestAPI from "../../core/repositories/rest-api";
import Loading from "../layout/loading.component";
import { Panel } from "primereact/panel";
import { i10n } from "../../config/prime-locale";

const percentageOfYear = 90 / 365

function BudgetBalance({ range } : Readonly<{ range : DateRange }>) {
    const [budgetSeries, setBudgetSeries] = useState<ChartData | undefined | null>()

    useEffect(() => {
        BudgetRepository.budgetMonth(range.year(), range.month())
            .then(async (budget: Budget) => {
                const expenses = budget.expenses

                setBudgetSeries({
                    labels: expenses.map(({ name }) => name),
                    datasets: [
                        {
                            label: i10n('graph.series.budget.expected'),
                            data: expenses.map(expense => expense.expected * 12 * percentageOfYear),
                            backgroundColor: '#9abdd2'
                        },
                        {
                            label: i10n('graph.series.budget.actual'),
                            data: (await Promise.all(
                                expenses.map((expense : BudgetExpense) =>
                                    StatisticalRepository.balance({
                                        range: range.toBackend(),
                                        type: 'EXPENSE',
                                        expenses: [ expense.id ]
                                    })))).map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#7fc6a5'
                        }
                    ]
                } as ChartData)
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
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const label = context.dataset.label || ''
                            const value = context.parsed.y.toFixed(2)
                            return `${label}: ${(RestAPI.user() as any).defaultCurrency?.symbol}${value}`
                        }
                    }
                }
            }
        }
    )

    return <Panel header={ i10n('page.dashboard.budgets.balance') }>
        { !budgetSeries && <Loading/> }
        { budgetSeries &&
            <Chart type='bar'
                   id='dashboard-budgets-graph'
                   height={ 300 }
                   options={ config }
                   data={ budgetSeries }/>
        }
    </Panel>
}

export default BudgetBalance
