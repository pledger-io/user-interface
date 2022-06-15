import React, {useState} from 'react'
import PropTypes from 'prop-types'

import {withNavigation, withPathParams} from "../core/hooks";
import {
    Attachments,
    BreadCrumbItem, BreadCrumbMenu,
    BreadCrumbs,
    Card,
    Charts,
    Dates, Dropdown,
    Formats,
    Loading,
    Statistical,
    Translations
} from "../core/index";

import '../assets/css/IncomeExpenseView.scss'
import restAPI from "../core/RestAPI";

const ROLLING_AVERAGE_MONTHS = 4;

class ReportService {
    computeMonths(year, rollingAverage = 0) {
        const monthsInYear = [...new Array(12).keys()]
            .map(x => x + 1)
            .map(month => Dates.Ranges.forMonth(year, month))

        if (rollingAverage > 0) {
            const additionalMonths = [...Array(rollingAverage).keys()]
                .map(x => 12 - rollingAverage + x + 1)
                .map(month => Dates.Ranges.forMonth(year - 1, month))
            return [...additionalMonths, ...monthsInYear]
        }

        return monthsInYear
    }

    retrieveBalances(dateRanges, currency, income = true) {
        return Promise.all(
            dateRanges.map(month => Statistical.Service.balance({
                onlyIncome: income,
                currency: currency,
                dateRange: {
                    start: month.startString(),
                    end: month.endString()
                }
            }))
        )
    }

    topAccounts(year, type) {
        const dateRange = Dates.Ranges.forYear(year)
        return restAPI.get(`accounts/top/${type}/${dateRange.startString()}/${dateRange.endString()}`)
    }

    accountBalances(year, currency) {
        return new Promise((resolve, failure) => {
            restAPI.get('accounts/my-own')
                .then(accounts => Promise.all(accounts.map(async account => {
                    return {
                        ...account,
                        balance: {
                            start: (await Statistical.Service.balance({
                                accounts: [account],
                                allMoney: true,
                                currency: currency,
                                dateRange: {
                                    start: '1970-01-01',
                                    end: `${year}-01-01`
                                }
                            })).balance,
                            end: (await Statistical.Service.balance({
                                accounts: [account],
                                allMoney: true,
                                currency: currency,
                                dateRange: {
                                    start: '1970-01-01',
                                    end: `${year + 1}-01-01`
                                }
                            })).balance
                        }
                    }
                })).then(resolve))
                .catch(failure)
        })
    }

    monthlyIncome(year, currency) {
        return new Promise(resolve => {
            this.retrieveBalances(this.computeMonths(year, ROLLING_AVERAGE_MONTHS), currency)
                .then(async incomes => resolve([
                    {
                        label: await Translations.LocalizationService.get('graph.series.income.sma'),
                        type: 'line',
                        borderColor: 'black',
                        borderDash: [10, 10],
                        data: incomes.filter((b, idx) => idx < (incomes.length - ROLLING_AVERAGE_MONTHS))
                            .map((balance, idx) => {
                            let expected = 0
                            for (let counter = 0; counter < ROLLING_AVERAGE_MONTHS; counter++) {
                                expected += incomes[idx + counter].balance
                            }
                            return expected / ROLLING_AVERAGE_MONTHS
                        })
                    },
                    {
                        label: await Translations.LocalizationService.get('graph.series.income'),
                        data: incomes.filter((x, idx) => idx >= ROLLING_AVERAGE_MONTHS)
                            .map(balance => balance.balance),
                        backgroundColor: '#7fc6a5'
                    }
                ]))
        })
    }

    monthlyExpense(year, currency) {
        return new Promise(resolve => {
            this.retrieveBalances(this.computeMonths(year, ROLLING_AVERAGE_MONTHS), currency, false)
                .then(async expenses => resolve([
                    {
                        label: await Translations.LocalizationService.get('graph.series.expenses.sma'),
                        type: 'line',
                        borderColor: '#9abdd2',
                        borderDash: [10, 10],
                        data: expenses.filter((b, idx) => idx < (expenses.length - ROLLING_AVERAGE_MONTHS))
                            .map((balance, idx) => {
                                let expected = 0
                                for (let counter = 0; counter < ROLLING_AVERAGE_MONTHS; counter++) {
                                    expected += expenses[idx + counter].balance
                                }
                                return Math.abs(expected / ROLLING_AVERAGE_MONTHS)
                            })
                    },
                    {
                        label: await Translations.LocalizationService.get('graph.series.expenses'),
                        backgroundColor: '#dc3545',
                        data: expenses.filter((x, idx) => idx >= ROLLING_AVERAGE_MONTHS)
                            .map(balance => Math.abs(balance.balance))
                    }
                ]))
        })
    }
}

const service = new ReportService()

class IncomeExpenseView extends React.Component {
    static propTypes = {
        year: PropTypes.number
    }

    state = {
        accounts: [],
        top: {
            debtor: [],
            creditor: []
        },
        currency: {},
        charts: {
            balance: {
                income: [],
                expenses: []
            }
        }
    }

    refresh() {
        const {year, currency} = this.props

        this.setState({year: year, currency: {code: currency}})
        const updateState = this.state

        Promise.all([
            service.monthlyIncome(year, currency)
                .then(series => updateState.charts.balance.income = series),
            service.monthlyExpense(year, currency)
                .then(series => updateState.charts.balance.expenses = series),
            service.accountBalances(year, currency)
                .then(accounts => updateState.accounts = accounts),
            service.topAccounts(year, 'debit')
                .then(topDebit => updateState.top.debtor = topDebit),
            service.topAccounts(year, 'creditor')
                .then(topCreditor => updateState.top.creditor = topCreditor),
            restAPI.get(`settings/currencies/${currency}`)
                .then(currency => updateState.currency = currency)
        ]).then(() => this.setState({
            ...updateState,
            loaded: true
        }))
    }

    render() {
        const {charts, year, loaded = false, top: {debtor, creditor}, currency: {symbol}} = this.state
        const {navigate, currency} = this.props
        if (this.props.year !== this.state.year || currency !== this.state.currency.code) {
            setTimeout(() => this.refresh(), 50)
        }

        const selectionChanged = ({newYear = year, newCurrency = currency}) => {
            this.setState({
                loaded: false
            })
            navigate(`/reports/income-expense/${newYear}/${newCurrency}`)
        }

        return (
            <div className='IncomeExpenseView'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.title.reports.default' />
                    <BreadCrumbItem label='page.reports.default.title' />
                    <BreadCrumbMenu>
                        <Dropdown.Currency currency={currency} onChange={currency => selectionChanged({newCurrency: currency.code})} />
                        <Dropdown.Year year={year} onChange={year => selectionChanged({newYear: year})}/>
                    </BreadCrumbMenu>
                </BreadCrumbs>

                <Card title='page.reports.default.title'>
                    {loaded && <Charts.Chart height={75}
                                  id='income-expense-graph'
                                  type='bar'
                                  labels={service.computeMonths(year)
                                      .map(monthRange => monthRange.start)}
                                  dataSets={[...charts.balance.income, ...charts.balance.expenses]}
                                  options={{
                                      scales: {
                                          x: {
                                              type: 'time',
                                              time: {
                                                  unit: 'month'
                                              }
                                          },
                                          y: {
                                              ticks: {
                                                callback: value => `${symbol}${value}`
                                              }
                                          }
                                      },
                                      plugins: {
                                          tooltip: {
                                              mode: 'point'
                                          },
                                          legend: {
                                              position: 'bottom',
                                              display: true
                                          }
                                      },
                                  }}/>}
                    {!loaded && <Loading />}
                </Card>
                <div className='Columns'>
                    <Card title='page.reports.default.balances'>
                        {this.renderAccountBalances()}
                    </Card>
                    <Card title='page.reports.default.title'>
                        {this.renderYearSummary()}
                    </Card>
                </div>
                <div className='Columns'>
                    <Card title='page.reports.default.top.debit'>
                        {this.renderTopAccounts(debtor)}
                    </Card>
                    <Card title='page.reports.default.top.credit'>
                        {this.renderTopAccounts(creditor)}
                    </Card>
                </div>
            </div>
        )
    }

    renderYearSummary() {
        const {loaded, year} = this.state
        const {currency} = this.props
        if (!loaded) {
            return <Loading />
        }

        const range = Dates.Ranges.forYear(year)
        return (
            <table className="Table YearSummary">
                <tbody>
                <tr>
                    <td><Translations.Translation label='common.in'/></td>
                    <td><Statistical.Balance currency={currency} income={true} range={range}/></td>
                </tr>
                <tr>
                    <td><Translations.Translation label='common.out'/></td>
                    <td><Statistical.Balance currency={currency} income={false} range={range}/></td>
                </tr>
                <tr>
                    <td><Translations.Translation label='common.difference'/></td>
                    <td><Statistical.Balance currency={currency} range={range}/></td>
                </tr>
                </tbody>
            </table>
        )
    }

    renderAccountBalances() {
        const {loaded, accounts} = this.state
        const {currency} = this.props
        if (!loaded) {
            return <Loading />
        }

        return (
            <table className='Table'>
                <thead>
                <tr>
                    <th><Translations.Translation label='Account.name'/></th>
                    <th><Translations.Translation label='page.reports.default.startBalance'/></th>
                    <th><Translations.Translation label='page.reports.default.endBalance'/></th>
                    <th><Translations.Translation label='common.difference'/></th>
                </tr>
                </thead>
                <tbody>
                {accounts.map(account =>
                    <tr key={account.id}>
                        <td>{account.name}</td>
                        <td><Formats.Money money={account.balance.start} currency={currency}/></td>
                        <td><Formats.Money money={account.balance.end} currency={currency}/></td>
                        <td><Formats.Money money={account.balance.end - account.balance.start} currency={currency}/></td>
                    </tr>)}
                </tbody>
            </table>
        )
    }

    renderTopAccounts(topAccounts) {
        const {loaded} = this.state
        if (!loaded) {
            return <Loading />
        }

        return (
            <table className='Table TopAccounts'>
                <thead>
                <tr>
                    <th colSpan="2"><Translations.Translation label='Account.name'/></th>
                    <th><Translations.Translation label='common.total'/></th>
                    <th><Translations.Translation label='common.average'/></th>
                </tr>
                </thead>
                <tbody>
                {topAccounts.map(account => (
                    <tr key={account.account.id}>
                        <td><Attachments.Image fileCode={account.account.iconFileCode}/></td>
                        <td>{account.account.name}</td>
                        <td><Formats.Money money={account.total * -1} currency={account.account.account.currency}/></td>
                        <td><Formats.Money money={account.average * -1} currency={account.account.account.currency}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}

const withPresetProps = withNavigation(withPathParams(props => {
    const [year, setYear] = useState(new Date().getFullYear())
    const [currency, setCurrency] = useState('EUR')

    props.pathContext.resolved = ({year, currency}) => {
        if (year) setYear(parseInt(year))
        if (currency) setCurrency(currency)
    }
    return <IncomeExpenseView year={year} currency={currency} navigate={props.navigate}/>
}))

export {
    withPresetProps as IncomeExpenseView
}
