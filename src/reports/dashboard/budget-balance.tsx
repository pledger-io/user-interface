import {Layout, Translations} from "../../core";
import React, {useEffect, useState} from "react";
import {BudgetRepository} from "../../core/RestAPI";
import {Loading} from "../../core/layout";
import {Chart} from "react-chartjs-2";
import {Range} from "../../core/Dates";
import {ChartData} from "chart.js";
import {Budget, BudgetExpense} from "../../core/types";
import StatisticalRepository from "../../core/repositories/statistical-repository";
import {DefaultChartConfig, Service} from "../../config/global-chart-config";

const percentageOfYear = 90 / 365

function BudgetBalance({ range } : {range : Range}) {
    const [budgetSeries, setBudgetSeries] = useState<ChartData | undefined | null>()

    useEffect(() => {
        BudgetRepository.forMonth(range.year(), range.month())
            .then(async (budget: Budget) => {
                const expenses = budget.expenses

                setBudgetSeries({
                    labels: expenses.map(({name}) => name),
                    datasets: [
                        {
                            label: await Translations.LocalizationService.get('graph.series.budget.expected'),
                            data: expenses.map(expense => expense.expected * 12 * percentageOfYear),
                            backgroundColor: '#9abdd2'
                        },
                        {
                            label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                            data: (await Promise.all(
                                expenses.map((expense : BudgetExpense) =>
                                    StatisticalRepository.balance({
                                        dateRange: range.toBackend(),
                                        onlyIncome: false,
                                        expenses: [{id: expense.id}]
                                    })))).map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#7fc6a5'
                        }
                    ]
                })
            })
            .catch(_ => setBudgetSeries({ labels: [], datasets: [] }))
    }, [range])

    return <>
        <Layout.Card title='page.dashboard.budgets.balance'>
            { budgetSeries === undefined && <Loading /> }
            { budgetSeries &&
                <Chart type='bar'
                       id='dashboard-budgets-graph'
                       height={ 300 }
                       options={ Service.mergeOptions(DefaultChartConfig.bar, {
                           plugins: {
                               legend: {
                                   position: 'bottom',
                                   display: true
                               }
                           }
                          }) }
                       data={ budgetSeries } />
            }
        </Layout.Card>
    </>
}

export default BudgetBalance