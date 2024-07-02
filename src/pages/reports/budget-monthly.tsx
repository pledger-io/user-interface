import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Currency, Year } from "../../components/layout/dropdown";

import { Dates } from "../../core";
import { Budget } from "../../core/types";
import BudgetRepository from "../../core/repositories/budget.repository";
import { CurrencyRepository } from "../../core/RestAPI";

import MonthlyTableComponent from "../../components/reports/budget-monthly/table.component";
import MonthlyPerBudgetTableComponent from "../../components/reports/budget-monthly/monthly-table.component";
import YearlyIncomeGraphComponent from "../../components/reports/budget-monthly/yearly-income.component";
import BudgetYearlyExpense from "../../components/reports/budget-monthly/yearly-expense.component";
import YearlyBudgetIncomeComponent from "../../components/reports/budget-monthly/yearly-budget-income.component";
import YearlyBudgetExpenseComponent from "../../components/reports/budget-monthly/yearly-budget-expense.component";
import Card from "../../components/layout/card.component";
import Grid from "../../components/layout/grid.component";

import '../../assets/css/BudgetReportView.scss'
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";

const BudgetReportView = () => {
    const [currencySymbol, setCurrencySymbol] = useState('')
    const [range, setRange] = useState(() => Dates.Ranges.currentYear())
    const { currency = 'EUR', year = "" + new Date().getFullYear() } = useParams()
    const [budgets, setBudgets] = useState<Budget[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        setRange(Dates.Ranges.forYear(parseInt(year)))

        Promise.all([...new Array(12).keys()]
            .map(month => BudgetRepository.budgetMonth(parseInt(year), month + 1)))
            .then(setBudgets)
            .catch(console.error)
    }, [year])
    useEffect(() => {
        CurrencyRepository.get(currency)
            .then((c) => setCurrencySymbol(c.symbol))
    }, [currency])

    const onDateChanged = ({
                               newYear = year,
                               newCurrency = currency
                           }) => navigate(`/reports/monthly-budget/${ newYear }/${ newCurrency }`)

    return <div className='BudgetReport'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.reports.default'/>
            <BreadCrumbItem label='page.reports.budget.title'/>
            <BreadCrumbItem message={ `${ range.year() }` }/>
            <BreadCrumbMenu className='flex justify-end'>
                <Currency currency={ currency }
                                   onChange={ currency => onDateChanged({ newCurrency: currency.code }) }/>
                <Year year={ range.year() } onChange={ year => onDateChanged({ newYear: `${ year }` }) }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Grid type='column' minWidth='25em'>
            <YearlyBudgetIncomeComponent range={ range } budgets={ budgets }/>
            <YearlyBudgetExpenseComponent range={ range } budgets={ budgets }/>
        </Grid>

        <Grid type='column' minWidth='25em'>
            <YearlyIncomeGraphComponent year={ parseInt(year) } budgets={ budgets } currencySymbol={ currencySymbol }/>
            <BudgetYearlyExpense year={ parseInt(year) } budgets={ budgets } currencySymbol={ currencySymbol }/>
        </Grid>

        <Card>
            <MonthlyTableComponent budgets={ budgets } year={ parseInt(year) } currency={ currency }/>
        </Card>

        <Card>
            <MonthlyPerBudgetTableComponent budgets={ budgets } year={ parseInt(year) } currency={ currency }/>
        </Card>
    </div>
}

export default BudgetReportView
