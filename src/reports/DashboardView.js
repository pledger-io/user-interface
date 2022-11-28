import React, {useEffect} from "react";
import {Card, Charts, Dates, Formats, Statistical, Translations, When} from "../core";
import Icon from "@mdi/react";
import {
    mdiContactlessPaymentCircle,
    mdiScaleBalance,
    mdiSwapVerticalCircle
} from "@mdi/js";
import restAPI from "../core/RestAPI";

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
    let comparisonClass = 'same'
    let comparisonKey = 'page.dashboard.summary.trend.same'

    useEffect(() => {
        if (current < previous) {
            comparisonClass = 'down'
            comparisonKey = 'page.dashboard.summary.trend.down'
        } else if (current > previous) {
            comparisonClass = 'up'
            comparisonKey = 'page.dashboard.summary.trend.up'
        }
    }, [current, previous])

    return (
        <Card>
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
        </Card>
    )
}


const percentageOfYear = DASHBOARD_DAYS / 365
const range = Dates.Ranges.previousDays(DASHBOARD_DAYS)
const compareRange = range.before(DASHBOARD_DAYS)
const service = new DashboardService()

class DashboardView extends React.Component {
    loaded = false;

    state = {
        income: {
            current: 0,
            previous: 0
        },
        expense: {
            current: 0,
            previous: 0
        },
        balance: {
            current: 0,
            previous: 0
        },
        budget: 0,
        budgets: [],
        categories: [],
        charts: {
            balanceSeries: [],
            budgets: [],
            categories: []
        }
    }

    refresh() {
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
        const state = this.state
        state.charts.budgets = []

        Promise.all([
            // balance fetching
            Statistical.Service.balance({dateRange: {start: '1970-01-01', end: compareRange.endString()}, allMoney: true})
                .then(response => state.balance.previous = response.balance),
            Statistical.Service.balance({dateRange: {start: '1970-01-01', end: range.endString()}, allMoney: true})
                .then(response => state.balance.current = response.balance),

            // Income fetching
            Statistical.Service.balance({...compareBaseCommand, onlyIncome: true})
                .then(response => state.income.previous = response.balance),
            Statistical.Service.balance({...baseCommand, onlyIncome: true})
                .then(response => state.income.current = response.balance),

            // Expense fetching
            Statistical.Service.balance({...compareBaseCommand, onlyIncome: false})
                .then(response => state.expense.previous = Math.abs(response.balance)),
            Statistical.Service.balance({...baseCommand, onlyIncome: false})
                .then(response => state.expense.current = Math.abs(response.balance)),

            service.budgets()
                .then(seriesData => {
                    state.budgets = seriesData.labels
                    state.charts.budgets = seriesData.data
                }),

            service.categories()
                .then(seriesData => {
                    state.categories = seriesData.labels
                    state.charts.categories = seriesData.data
                }),

            Charts.SeriesProvider.balanceSeries({
                id: 'balance-series',
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: true
            }).then(result => state.charts.balanceSeries = [result])
        ]).then(() => this.setState({
            ...state,
            loaded: true
        }))
    }

    render() {
        const {income, expense, balance, budget, budgets, categories, charts} = this.state

        if (!this.loaded) {
            this.loaded = true
            setTimeout(() => this.refresh(), 10);
        }

        return (
            <div className='Dashboard'>
                <div className='Summary'>
                    <SummaryComponent
                        title='page.dashboard.income'
                        icon={mdiSwapVerticalCircle}
                        current={income.current}
                        previous={income.previous}
                        currency='EUR' />

                    <SummaryComponent
                        title='page.dashboard.expense'
                        icon={mdiContactlessPaymentCircle}
                        current={expense.current}
                        previous={expense.previous}
                        currency='EUR' />

                    <SummaryComponent
                        title='page.dashboard.balance'
                        icon={mdiScaleBalance}
                        current={balance.current}
                        previous={balance.previous}
                        currency='EUR' />

                    <SummaryComponent
                        title='page.dashboard.budget'
                        current={budget}
                        currency='EUR' />
                </div>

                <Card title='page.dashboard.accounts.balance'>
                    <Charts.Chart height={75}
                                  id='dashboard-balance-graph'
                                  dataSets={charts.balanceSeries}>
                    </Charts.Chart>
                </Card>

                <div>
                    <Card title='page.dashboard.budgets.balance'>
                        <Charts.Chart height={125}
                                      id='dashboard-budgets-graph'
                                      labels={budgets}
                                      dataSets={charts.budgets}
                                      type='bar'
                                      options={{
                                          plugins: {
                                              legend: {
                                                  position: 'bottom',
                                                  display: true
                                              }
                                          },
                                      }}/>
                    </Card>
                    <Card title='page.dashboard.categories.balance'>
                        <Charts.Chart height={125}
                                      id='dashboard-categories-graph'
                                      labels={categories}
                                      dataSets={charts.categories}
                                      type='bar' />
                    </Card>
                </div>
            </div>
        )
    }
}

export {
    DashboardView
}
