import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Currency, Year } from "../../components/layout/dropdown";
import MonthlyPerBudgetTableComponent from "../../components/reports/budget-monthly/monthly-table.component";
import MonthlyTableComponent from "../../components/reports/budget-monthly/table.component";
import YearlyBudgetExpenseComponent from "../../components/reports/budget-monthly/yearly-budget-expense.component";
import YearlyBudgetIncomeComponent from "../../components/reports/budget-monthly/yearly-budget-income.component";
import BudgetYearlyExpense from "../../components/reports/budget-monthly/yearly-expense.component";
import YearlyIncomeGraphComponent from "../../components/reports/budget-monthly/yearly-income.component";
import { i10n } from "../../config/prime-locale";
import BudgetRepository from "../../core/repositories/budget.repository";
import { CurrencyRepository } from "../../core/RestAPI";
import DateRangeService from "../../service/date-range.service";
import { Budget } from "../../types/types";

const BudgetReportView = () => {
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [range, setRange] = useState(() => DateRangeService.currentYear())
  const { currency = 'EUR', year = "" + new Date().getFullYear() } = useParams()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRange(DateRangeService.forYear(parseInt(year)))

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

    <div className='mx-2 my-4 block md:flex gap-2 justify-normal'>
      <Panel header={ i10n('page.reports.budget.incomePercent') } className='flex-1 overflow-hidden'>
        <YearlyBudgetIncomeComponent range={ range } budgets={ budgets }/>
      </Panel>
      <Panel header={ i10n('page.reports.budget.expensePercent') } className='flex-1 overflow-hidden'>
        <YearlyBudgetExpenseComponent range={ range } budgets={ budgets }/>
      </Panel>
    </div>

    <div className='mx-2 my-4 block md:flex gap-2'>
      <Panel header={ i10n('page.reports.budget.incomePercent') } className='flex-1'>
        <YearlyIncomeGraphComponent year={ parseInt(year) } budgets={ budgets } currencySymbol={ currencySymbol }/>
      </Panel>
      <Panel header={ i10n('page.reports.budget.expensePercent') } className='flex-1'>
        <BudgetYearlyExpense year={ parseInt(year) } budgets={ budgets } currencySymbol={ currencySymbol }/>
      </Panel>
    </div>

    <Card className='mx-2 my-4'>
      <MonthlyTableComponent budgets={ budgets } year={ parseInt(year) } currency={ currency }/>
    </Card>

    <Card className='mx-2 my-4'>
      <MonthlyPerBudgetTableComponent budgets={ budgets } year={ parseInt(year) } currency={ currency }/>
    </Card>
  </div>
}

export default BudgetReportView
