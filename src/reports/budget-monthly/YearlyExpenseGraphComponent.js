import React, {useEffect, useState} from "react";
import {Charts, Dates, Layout, Statistical, Translations} from "../../core";

const YearlyExpenseGraphComponent = ({year = 1970, budgets = []}) => {
    const [expectedDataset, setExpectedDataset] = useState()
    const [actualDataset, setActualDataset]     = useState()

    useEffect(() => {
        setExpectedDataset(undefined)
        Translations.LocalizationService.get('graph.series.budget.expected')
            .then(t => setExpectedDataset({
                label: t,
                data: budgets.map(({expenses}) => expenses.reduce((total, {expected}) => total + expected, 0)),
                borderColor: '#f0c77c',
                backgroundColor: '#f0c77c'
            }))
    }, [budgets])

    useEffect(() => {
        const allExpenses = [...new Set(budgets.reduce((left, right) => [...left, ...right.expenses.map(e => e.id)], []))]
            .map(id => {
                return {
                    id: id
                }
            })

        setActualDataset(undefined)
        Promise.all(
            [...new Array(12).keys()]
                .map(m => Statistical.Service.balance({
                    dateRange: Dates.Ranges.forMonth(year, m + 1),
                    onlyIncome: false,
                    expenses: allExpenses
                })))
            .then(monthly => monthly.map(({balance}) => Math.abs(balance)))
            .then(async data => setActualDataset({
                data: data,
                label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                borderColor: '#de7370',
                backgroundColor: '#de7370'
            }))
    }, [budgets, year])

    const labels = [...new Array(12).keys()]
        .map(m => Dates.Ranges.forMonth(year, m + 1))
        .map(m => m.start)

    return <>
        <Layout.Card title='page.reports.budget.expensePercent'>
            {actualDataset && expectedDataset && <>
                <Charts.Chart id='budget-expense'
                              type='line'
                              labels={labels}
                              dataSets={[expectedDataset, actualDataset]}
                              options={{
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
                              }}
                              height={300} />
            </>}
            {(!actualDataset || !expectedDataset) && <Layout.Loading />}
        </Layout.Card>
    </>
}

export default YearlyExpenseGraphComponent
