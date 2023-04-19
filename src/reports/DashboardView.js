import React, {useEffect, useState} from "react";
import {Charts, Dates, Formats, Layout, Statistical, Translations} from "../core";
import Icon from "@mdi/react";
import {mdiContactlessPaymentCircle, mdiScaleBalance, mdiSwapVerticalCircle} from "@mdi/js";
import restAPI from "../core/repositories/rest-api"

import '../assets/css/DashboardView.scss'

const DASHBOARD_DAYS = 90

class DashboardService {
    budgets() {
        return new Promise((resolved, failed) => {
            restAPI.get(`budgets/${range.start.getFullYear()}/${range.start.getMonth()}`)
                .then(async budget => {
                    const expenses = budget.expenses
                    resolved({
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
                .catch(failed)
        })
    }

    categories() {
        return new Promise((resolved, failed) => {
            restAPI.get('categories')
                .then(async categories => {
                    resolved({
                        labels: categories.map(c => c.label),
                        data: {
                            label: await Translations.LocalizationService.get('graph.series.category'),
                            backgroundColor: '#9abdd2',
                            data: (await Promise.all(
                                categories.map(c =>
                                    Statistical.Service.balance({
                                        dateRange: range,
                                        categories: [
                                            {id: c.id}
                                        ]
                                    })))).map(b => b.balance)
                        }
                    })
                })
                .catch(failed)
        })
    }
}

const SummaryComponent = ({currency, current, previous, title, icon}) => {
    const [comparisonClass, setComparisonClass]    = useState('same')
    const [comparisonKey, setComparisonKey]        = useState('page.dashboard.summary.trend.same')

    useEffect(() => {
        if (current < previous) {
            setComparisonKey('page.dashboard.summary.trend.down')
            setComparisonClass('down')
        } else if (current > previous) {
            setComparisonKey('page.dashboard.summary.trend.up')
            setComparisonClass('up')
        }
    }, [current, previous])

    return (
        <Layout.Card>
            <div>
                <h1><Translations.Translation label={title} /></h1>
                <Formats.Money money={current} currency={currency} />
                { previous && (
                    <div className={`Comparison ${comparisonClass}`}>
                        <Translations.Translation label={comparisonKey} />
                    </div>
                )}
            </div>
            {icon && <div className="Icon"><Icon path={icon}/></div>}
        </Layout.Card>
    )
}


const percentageOfYear = DASHBOARD_DAYS / 365
const range = Dates.Ranges.previousDays(DASHBOARD_DAYS)
const compareRange = range.before(DASHBOARD_DAYS)
const service = new DashboardService()

const baseCommand = {
    dateRange: {
        start: range.startString(),
        end: range.endString()
    }
}
const compareBaseCommand = {
    dateRange: {
        start: compareRange.startString(),
        end: compareRange.endString()
    }
}

export const DashboardView = () => {
    const [currentIncome, setCurrentIncome]     = useState(0)
    const [currentExpense, setCurrentExpense]   = useState(0)
    const [currentBalance, setCurrentBalance]   = useState(0)
    const [previousIncome, setPreviousIncome]   = useState(0)
    const [previousExpense, setPreviousExpense] = useState(0)
    const [previousBalance, setPreviousBalance] = useState(0)
    const [budget]                              = useState(0)

    const [balanceSeries, setBalanceSeries]     = useState([])
    const [budgetSeries, setBudgetSeries]       = useState({labels: [], data: []})
    const [categorySeries, setCategorySeries]   = useState({labels: [], data: []})


    useEffect(() => {
        Statistical.Service.balance({dateRange: {start: '1970-01-01', end: compareRange.endString()}, allMoney: true})
            .then(({balance}) => setPreviousBalance(balance))
        Statistical.Service.balance({dateRange: {start: '1970-01-01', end: range.endString()}, allMoney: true})
            .then(({balance}) => setCurrentBalance(balance))
        Statistical.Service.balance({...compareBaseCommand, onlyIncome: true})
            .then(({balance}) => setPreviousIncome(balance))
        Statistical.Service.balance({...baseCommand, onlyIncome: true})
            .then(({balance}) => setCurrentIncome(balance))

        Statistical.Service.balance({...compareBaseCommand, onlyIncome: false})
            .then(({balance}) => setPreviousExpense(Math.abs(balance)))
        Statistical.Service.balance({...baseCommand, onlyIncome: false})
            .then(({balance}) => setCurrentExpense(Math.abs(balance)))

        service.budgets()
            .then(setBudgetSeries)
        service.categories()
            .then(setCategorySeries)

        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true
        }).then(result => setBalanceSeries([result]))
    }, [])

    return <div className='Dashboard'>
        <div className='Summary Columns'>
            <SummaryComponent
                title='page.dashboard.income'
                icon={mdiSwapVerticalCircle}
                current={currentIncome}
                previous={previousIncome}
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.expense'
                icon={mdiContactlessPaymentCircle}
                current={currentExpense}
                previous={previousExpense}
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.balance'
                icon={mdiScaleBalance}
                current={currentBalance}
                previous={previousBalance}
                currency='EUR' />

            <SummaryComponent
                title='page.dashboard.budget'
                current={budget}
                currency='EUR' />
        </div>

        <Layout.Card title='page.dashboard.accounts.balance'>
            <Charts.Chart height={400}
                          id='dashboard-balance-graph'
                          dataSets={balanceSeries}>
            </Charts.Chart>
        </Layout.Card>

        <Layout.Grid type='column' minWidth='35em'>
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

            <Layout.Card title='page.dashboard.categories.balance'>
                <Charts.Chart height={300}
                              id='dashboard-categories-graph'
                              labels={categorySeries.labels}
                              dataSets={categorySeries.data}
                              type='bar' />
            </Layout.Card>
        </Layout.Grid>
    </div>
}
