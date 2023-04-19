import React, {useEffect, useState} from "react";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Dates,
    Dropdown,
    Layout,
    Progressbar,
    Statistical
} from "../../core";
import {useNavigate, useParams} from "react-router-dom";
import {BudgetRepository} from "../../core/RestAPI";

import MonthlyTableComponent from "./BudgetTableComponent";
import MonthlyPerBudgetTableComponent from "./MonthlyTableComponent";
import YearlyIncomeGraphComponent from "./YearlyIncomeGraphComponent";
import YearlyExpenseGraphComponent from "./YearlyExpenseGraphComponent";

import '../../assets/css/BudgetReportView.scss'

export const BudgetReportView = () => {
    const [range, setRange] = useState(() => Dates.Ranges.currentYear())
    const {currency = 'EUR', year = new Date().getFullYear()} = useParams()
    const [budgets, setBudgets] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        if (year) {
            setRange(Dates.Ranges.forYear(parseInt(year)))

            Promise.all([...new Array(12).keys()]
                .map(month => BudgetRepository.forMonth(year, month + 1)))
                .then(setBudgets)
        }
    }, [year])

    const onDateChanged = ({
                               newYear = year,
                               newCurrency = currency
                           }) => navigate(`/reports/monthly-budget/${newYear}/${newCurrency}`)

    return <div className='BudgetReport'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.reports.default'/>
            <BreadCrumbItem label='page.reports.budget.title'/>
            <BreadCrumbItem message={`${range.year()}`}/>
            <BreadCrumbMenu>
                <Dropdown.Currency currency={currency}
                                   onChange={currency => onDateChanged({newCurrency: currency.code})}/>
                <Dropdown.Year year={range.year()} onChange={year => onDateChanged({newYear: year})}/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Layout.Grid type='column' minWidth='35em'>
            <YearlyBudgetIncomeComponent range={range} budgets={budgets}/>
            <YearlyBudgetExpenseComponent range={range} budgets={budgets}/>
        </Layout.Grid>

        <Layout.Grid type='column' minWidth='35em'>
            <YearlyIncomeGraphComponent year={parseInt(year)} budgets={budgets}/>
            <YearlyExpenseGraphComponent year={parseInt(year)} budgets={budgets}/>
        </Layout.Grid>

        <Layout.Card>
            {budgets.length > 0 && <MonthlyTableComponent budgets={budgets} year={year} currency={currency}/>}
        </Layout.Card>

        <Layout.Card>
            {budgets.length > 0 && <MonthlyPerBudgetTableComponent budgets={budgets} year={year} currency={currency}/>}
        </Layout.Card>
    </div>
}

const YearlyBudgetIncomeComponent = ({range, budgets = []}) => {
    const [yearlyIncome, setYearlyIncome] = useState(0)
    const [yearlyExpected, setYearlyExpected] = useState(0)

    useEffect(() => {
        Statistical.Service.balance({
                onlyIncome: true,
                dateRange: range
            }
        ).then(b => setYearlyIncome(b.balance))
    }, [range])
    useEffect(() => {
        setYearlyExpected(budgets.reduce((left, right) => left + right.income, 0))
    }, [budgets])

    return <>
        <Layout.Card title='page.reports.budget.incomePercent'>
            <Progressbar total={yearlyExpected}
                         className='success'
                         current={yearlyIncome}/>
        </Layout.Card>
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
        <Layout.Card title='page.reports.budget.expensePercent'>
            <Progressbar total={yearlyExpected}
                         className='warning'
                         current={yearlyExpenses}/>
        </Layout.Card>
    </>
}