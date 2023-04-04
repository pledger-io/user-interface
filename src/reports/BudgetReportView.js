import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Card,
    Charts,
    Dates,
    Dropdown,
    Formats,
    Loading,
    Progressbar,
    Statistical,
    Translations
} from "../core";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BudgetRepository} from "../core/RestAPI";

import '../assets/css/BudgetReportView.scss'

export const BudgetReportView = () => {
    const [range, setRange]                     = useState(Dates.Ranges.currentYear)
    const {currency = 'EUR', year}              = useParams()
    const [budgets, setBudgets]                 = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        if (year) {
            setRange(Dates.Ranges.forYear(parseInt(year)))

            Promise.all([...new Array(12).keys()]
                .map(month => BudgetRepository.forMonth(year, month + 1)))
                .then(setBudgets)
        }
    }, [year])

    const onDateChanged = ({newYear = year, newCurrency = currency}) => navigate(`/reports/monthly-budget/${newYear}/${newCurrency}`)

    return <div className='BudgetReport'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.reports.default' />
            <BreadCrumbItem label='page.reports.budget.title' />
            <BreadCrumbItem message={`${range.year()}`} />
            <BreadCrumbMenu>
                <Dropdown.Currency currency={currency} onChange={currency => onDateChanged({newCurrency: currency.code})} />
                <Dropdown.Year year={range.year()} onChange={year => onDateChanged({newYear: year})}/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <div className="Columns">
            <YearlyBudgetIncomeComponent range={range} budgets={budgets} />
            <YearlyBudgetExpenseComponent range={range} budgets={budgets} />
        </div>

        <div className="Columns">
            <YearlyIncomeGraphComponent year={parseInt(year)} budgets={budgets} />
            <YearlyExpenseGraphComponent year={parseInt(year)} budgets={budgets} />
        </div>

        <Card>
            {budgets.length > 0 && <MonthlyTableBudgetComponent budgets={budgets} year={year} currency={currency} />}
        </Card>

        <Card>
            {budgets.length > 0 && <MonthlyPerBudgetTableComponent budgets={budgets} year={year} currency={currency} />}
        </Card>
    </div>
}

const MonthlyPerBudgetTableComponent = ({budgets, year, currency}) => {
    const [months, setMonths]                   = useState([])
    const [expenses, setExpenses]               = useState([])

    useEffect(() => {
        const ranges = [...new Array(12).keys()]
            .map(month => Dates.Ranges.forMonth(year, month + 1))
        setMonths(ranges)
    }, [year])
    useEffect(() => {
        const reduced = budgets.reduce((expenses, budget) => [...expenses, ...budget.expenses], [])
        const unique = reduced.filter((e, i) => reduced.findIndex(a => a.id === e.id) === i)
        setExpenses(unique)
    }, [budgets])

    return <>
        <table className='Table'>
            <thead>
            <tr>
                <th><Translations.Translation label='Budget.Expense.name'/></th>
                {months.map(month => <th key={month.month()}><Translations.Translation label={`common.month.${month.month()}`}/></th>)}
            </tr>
            </thead>
            <tbody>
            {expenses.map(expense => <MonthlyBudgetTableRow key={expense.id} months={months} currency={currency} expense={expense} />)}
            </tbody>
        </table>
    </>
}

const MonthlyBudgetTableRow = ({months, expense, currency}) => {
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        Promise.all(months.map(month => Statistical.Service.balance({
            expenses: [expense],
            dateRange: month,
            onlyIncome: false,
            currency: currency
        })))
            .then(balances => balances.map(({balance}) => balance))
            .then(setExpenses)
    }, [expense, months, currency])

    return <tr key={expense.id}>
        <td>{expense.name}</td>
        {months.map((_, idx) => <td key={idx}><Formats.Money money={expenses[idx]} currency={currency}/></td>)}
    </tr>
}

const MonthlyTableBudgetComponent = ({budgets, year, currency}) => {
    const [months, setMonths]                   = useState([])
    const [monthlyExpenses, setMonthlyExpenses] = useState([])

    useEffect(() => {
        const ranges = [...new Array(12).keys()]
            .map(month => Dates.Ranges.forMonth(year, month + 1))

        Promise.all(ranges.map(month => Statistical.Service.balance({
                onlyIncome: false,
                dateRange: month
            })))
            .then(expenses => expenses.map(({balance}) => Math.abs(balance)))
            .then(setMonthlyExpenses)

        setMonths(ranges)
    }, [year])

    if (!budgets.length) return <Loading />
    return <>
        <table className='Table MonthlyView'>
            <thead>
            <tr>
                <th><Translations.Translation label='common.month'/></th>
                <th><Translations.Translation label='Transaction.budget'/></th>
                <th><Translations.Translation label='graph.series.budget.actual'/></th>
                <th><Translations.Translation label='common.difference'/></th>
                <th><Translations.Translation label='common.percentage'/></th>
            </tr>
            </thead>
            <tbody>
            { months.map((month, idx) => {
                const expectedExpenses = 0 + budgets[idx].expenses.reduce((total, e) => total + e.expected, 0)
                const percentageOfExpected = monthlyExpenses[idx] / expectedExpenses
                return <tr key={month.month()} className={percentageOfExpected > 1 ? 'warning' : 'success'}>
                        <td><Translations.Translation label={`common.month.${month.month()}`} /></td>
                        <td><Formats.Money money={expectedExpenses} currency={currency}/></td>
                        <td><Formats.Money money={monthlyExpenses[idx]} currency={currency}/></td>
                        <td><Formats.Money money={expectedExpenses - monthlyExpenses[idx]} currency={currency} /></td>
                        <td className={percentageOfExpected > 1 ? 'warning' : 'success'}><Formats.Percent percentage={percentageOfExpected} decimals={2} /></td>
                    </tr>
            }) }
            </tbody>
        </table>
    </>
}

const YearlyIncomeGraphComponent = ({year = 1970, budgets = []}) => {
    const [expectedDataset, setExpectedDataset] = useState()
    const [actualDataset, setActualDataset]     = useState()

    useEffect(() => {
        Translations.LocalizationService.get('graph.series.budget.expected')
            .then(t => setExpectedDataset({
                label: t,
                data: budgets.map(({income}) => income),
                borderColor: '#f0c77c',
                backgroundColor: '#f0c77c'
            }))
    }, [budgets])
    useEffect(() => {
        Promise.all(
            [...new Array(12).keys()]
                .map(m => Statistical.Service.balance({
                    dateRange: Dates.Ranges.forMonth(year, m + 1),
                    onlyIncome: true
                }))
        )
            .then(monthly => monthly.map(({balance}) => balance))
            .then(async data => setActualDataset({
                data: data,
                label: await Translations.LocalizationService.get('graph.series.budget.actual'),
                borderColor: '#6996b2',
                backgroundColor: '#6996b2'
            }))
    }, [year])

    const labels = [...new Array(12).keys()]
            .map(m => Dates.Ranges.forMonth(year, m + 1))
            .map(m => m.start)

    return <>
        <Card title='page.reports.budget.incomePercent'>
            {actualDataset && expectedDataset && <>
                <Charts.Chart id='budget-income'
                              type='line'
                              dataSets={[expectedDataset, actualDataset]}
                              labels={labels}
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
                              height={100} />
            </>}
            {(!actualDataset || !expectedDataset) && <Loading />}
        </Card>
    </>
}

const YearlyExpenseGraphComponent = ({year = 1970, budgets = []}) => {
    const [expectedDataset, setExpectedDataset] = useState()
    const [actualDataset, setActualDataset]     = useState()

    useEffect(() => {
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
        <Card title='page.reports.budget.expensePercent'>
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
                              height={100} />
            </>}
            {(!actualDataset || !expectedDataset) && <Loading />}
        </Card>
    </>
}

const YearlyBudgetIncomeComponent = ({range, budgets = []}) => {
    const [yearlyIncome, setYearlyIncome]       = useState(0)
    const [yearlyExpected, setYearlyExpected]   = useState(0)
    
    useEffect(() => {
        Statistical.Service.balance({
            onlyIncome: true, 
            dateRange: range}
        ).then(b => setYearlyIncome(b.balance))
    }, [range])
    useEffect(() => {
        setYearlyExpected(budgets.reduce((left, right) => left + right.income, 0))
    }, [budgets])
    
    return <>
        <Card title='page.reports.budget.incomePercent'>
            <Progressbar total={yearlyExpected}
                         className='success'
                         current={yearlyIncome} />
        </Card>
    </>
}

const YearlyBudgetExpenseComponent = ({budgets = [], range}) => {
    const [yearlyExpenses, setYearlyExpenses] = useState(0)
    const [yearlyExpected, setYearlyExpected] = useState(0)

    useEffect(() => {
        const expected = budgets.reduce(
            (total, b) => total + b.expenses.reduce(
                (subTotal, e) => subTotal + e.expected,
                0),
            0)
        setYearlyExpected(expected)
    }, [budgets])

    useEffect(() => {
        const allExpenses = [...new Set(budgets.reduce((left, right) => [...left, ...right.expenses.map(e => e.id)], []))]
            .map(id => {
                return {
                    id: id
                }
            })

        Statistical.Service.balance({
            expenses: allExpenses,
            onlyIncome: false,
            dateRange: range
        }).then(({balance}) => setYearlyExpenses(Math.abs(balance)))
    }, [budgets, range])

    return <>
        <Card title='page.reports.budget.expensePercent'>
            <Progressbar total={yearlyExpected}
                         className='warning'
                         current={yearlyExpenses} />
        </Card>
    </>
}
