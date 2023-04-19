import {Charts, Layout, Statistical, Translations} from "../../core";
import React, {useEffect, useState} from "react";
import {BudgetRepository} from "../../core/RestAPI";

const percentageOfYear = 90 / 365

const BudgetBalance = ({ range }) => {
    const [budgetSeries, setBudgetSeries] = useState({labels: [], data: []})

    useEffect(() => {
        BudgetRepository.forMonth(range.year(), range.month())
            .then(async budget => {
                const expenses = budget.expenses

                setBudgetSeries({
                    labels: expenses.map(expense => expense.name),
                    data: [
                        {
                            label: await Translations.LocalizationService.get('graph.series.budget.expected'),
                            data: expenses.map(expense => expense.expected * 12 * percentageOfYear),
                            backgroundColor: '#9abdd2'
                        },
                        {
                            label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                            data: (await Promise.all(
                                expenses.map(expense =>
                                    Statistical.Service.balance({
                                        dateRange: range,
                                        expenses: [
                                            {id: expense.id}
                                        ]
                                    })))).map(balance => Math.abs(balance.balance)),
                            backgroundColor: '#7fc6a5'
                        }
                    ]
                })
            })
    }, [range])

    return <>
        <Layout.Card title='page.dashboard.budgets.balance'>
            <Charts.Chart height={300}
                          id='dashboard-budgets-graph'
                          labels={budgetSeries.labels}
                          dataSets={budgetSeries.data}
                          type='bar'
                          options={{
                              plugins: {
                                  legend: {
                                      position: 'bottom',
                                      display: true
                                  }
                              },
                          }}/>
        </Layout.Card>
    </>
}

export default BudgetBalance