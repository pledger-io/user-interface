import React, {useEffect, useState} from 'react'
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Charts,
    Dates,
    Dropdown,
    Formats,
    Layout,
    Loading,
    Statistical,
    Translations
} from "../core/index";

import {AccountRepository, CurrencyRepository} from "../core/RestAPI";
import {useNavigate, useParams} from "react-router-dom";

import '../assets/css/IncomeExpenseView.scss'

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

    accountBalances(year, currency) {
        return new Promise((resolve, failure) => {
            AccountRepository.own()
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

const BalanceChart = ({currencySymbol, year, currency}) => {
    const [labels, setLabels]           = useState([])
    const [incomeData, setIncomeData]   = useState([])
    const [expenseData, setExpenseData] = useState([])

    useEffect(() => {
        setLabels(service.computeMonths(year)
            .map(monthRange => monthRange.start))
    }, [year])

    useEffect(() => {
        if (year) {
            service.monthlyExpense(year, currency)
                .then(setExpenseData)
            service.monthlyIncome(year, currency)
                .then(setIncomeData)
        }
    }, [year, currency])

    return (
        <Charts.Chart height={400}
                      id='income-expense-graph'
                      type='bar'
                      labels={labels}
                      dataSets={[...incomeData, ...expenseData]}
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
                                      callback: value => `${currencySymbol}${value}`
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
                      }} />
    )
}

const AccountBalances = ({year, currency}) => {
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        service.accountBalances(year, currency)
            .then(setAccounts)
    }, [year, currency])

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
            {accounts.length === 0 && <tr>
                <td style={{textAlign: 'center'}} colSpan='4'><Loading /></td>
            </tr>}
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

const YearSummary = ({currency, year}) => {
    const [range, setRange] = useState(Dates.Ranges.currentYear())

    useEffect(() => {
        setRange(Dates.Ranges.forYear(year))
    }, [year])

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

const TopAccountTable = ({year, type}) => {
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        AccountRepository.top(type, year)
            .then(setAccounts)
    }, [year, type])

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
            {!accounts.length && <tr>
                <td colSpan='4'><Loading /></td>
            </tr>}
            {accounts.map(account => (
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

export const IncomeExpenseView = () => {
    const [currencySymbol, setCurrencySymbol] = useState('')
    const [range, setRange]                   = useState(Dates.Ranges.currentYear())
    const {year = range.year(), currency = 'EUR'} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        setRange(Dates.Ranges.forYear(parseInt(year)))
    }, [year])
    useEffect(() => {
        CurrencyRepository.get(currency)
            .then(({symbol}) => setCurrencySymbol(symbol))
    }, [currency])

    const onDateChanged = ({newYear = year, newCurrency = currency}) => navigate(`/reports/income-expense/${newYear}/${newCurrency}`)

    return (
        <div className='IncomeExpenseView'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.title.reports.default' />
                <BreadCrumbItem label='page.reports.default.title' />
                <BreadCrumbMenu>
                    <Dropdown.Currency currency={currency} onChange={currency => onDateChanged({newCurrency: currency.code})} />
                    <Dropdown.Year year={parseInt(year)} onChange={year => onDateChanged({newYear: year})}/>
                </BreadCrumbMenu>
            </BreadCrumbs>

            <Layout.Card title='page.reports.default.title'>
                <BalanceChart year={year} currencySymbol={currencySymbol} currency={currency} />
            </Layout.Card>

            <div className='Columns'>
                <Layout.Card title='page.reports.default.balances'>
                    <AccountBalances currency={currency} year={parseInt(year)} />
                </Layout.Card>
                <Layout.Card title='page.reports.default.title'>
                    <YearSummary year={parseInt(year)} currency={currency} />
                </Layout.Card>
            </div>

            <div className='Columns'>
                <Layout.Card title='page.reports.default.top.debit'>
                    <TopAccountTable year={year} type={'debit'} />
                </Layout.Card>
                <Layout.Card title='page.reports.default.top.credit'>
                    <TopAccountTable year={year} type={'creditor'} />
                </Layout.Card>
            </div>
        </div>
    )
}
