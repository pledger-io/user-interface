import { DataView } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import React, { useEffect, useState } from "react";
import { i10n } from "../../config/prime-locale";
import BudgetRepository, { ComputedExpense } from "../../core/repositories/budget.repository";
import DateRange from "../../types/date-range.type";
import { Budget, BudgetExpense, Identifier } from "../../types/types";
import DateComponent from "../format/date.component";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import { AddExpenseDialog } from "./add-expense-dialog";
import ExpenseActions from "./budget-expense-actions.component";
import { BudgetSummary } from "./budget-summary";

const currentMonth = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  isSame: (year: number, month: number) => year === currentMonth.year && month === currentMonth.month
}

type MappedExpense = {
  id: Identifier,
  computed: ComputedExpense
}

const BudgetDetailComponent = ({ range }: { range: DateRange }) => {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [computedExpenses, setComputedExpenses] = useState<MappedExpense[]>()

  const loadBudget = () => {
    BudgetRepository.budgetMonth(range.year(), range.month())
      .then(budget => {
        Promise.all(
          budget.expenses.map(e =>
            BudgetRepository.compute(e.id, range.year(), range.month())
              .then((computed): MappedExpense => {
                return {
                  id: e.id,
                  computed: computed[0]
                }
              })
          ))
          .then(computedExpenses => {
            setBudget(budget)
            setComputedExpenses(computedExpenses)
          })
      })
      .catch(console.error)
  }
  useEffect(loadBudget, [range]);

  const getComputedExpense = (id: Identifier) => {
    if (!computedExpenses) return undefined
    return computedExpenses.find(e => e.id === id)
  }

  if (!budget) return <Loading/>
  return <>
    <BudgetSummary budget={ budget } computedExpenses={ computedExpenses?.map(r => r.computed) || [] }/>

    <Divider/>

    <div className='flex justify-end mt-4'>
      { currentMonth.isSame(range.year(), range.month()) && <AddExpenseDialog onChange={ loadBudget }/> }
    </div>

    <DataView value={ budget.expenses }
              itemTemplate={ expense => budgetTemplate(budget.period.from, expense, getComputedExpense(expense.id)!, loadBudget) }
              loading={ !budget || !computedExpenses } />

    <Tooltip target='.with-tooltip' position='bottom' />
  </>
}

const budgetTemplate = (startDate: string, expense: BudgetExpense, computed: MappedExpense, loadBudgets: () => void) => {
  const percentage = (Math.abs(computed?.computed.spent || 0) / expense.expected * 100)
  return <div className='flex flex-col gap-1 my-2'>
    <div className='flex justify-between items-center gap-1'>
      <div className='flex items-center gap-2 flex-1'>
        <strong>{ expense.name }</strong>
        <span className='text-muted text-sm'>(<MoneyComponent money={ expense.expected } className='!text-muted'/> per month)</span>
      </div>
      <div className='flex items-center gap-1'>
        <span data-pr-tooltip={ i10n('page.budget.group.expense.spent') } className='with-tooltip'>
          <MoneyComponent money={ Math.abs(computed?.computed.spent || 0) } className='!text-muted' />
        </span>
        /
        <span data-pr-tooltip={ i10n('page.budget.group.expense.budgeted') } className='with-tooltip'>
          <MoneyComponent money={ expense.expected } className='!text-muted'/>
        </span>
      </div>
      <div>
        <ExpenseActions expense={ expense } callback={ loadBudgets }/>
      </div>
    </div>
    <ProgressBar className='!h-7 !rounded-lg !bg-gray-200 [&>.p-progressbar-value]:rounded-xl opacity-70'
                 showValue={ false }
                 color={ percentage >= 95 ? '#950915' : 'oklch(0.64 0.18 145.23)' }
                 value={ percentage.toFixed(0) } />
    <div className='text-sm text-gray-500'>
      Since: <DateComponent date={ startDate }/>
    </div>
  </div>
}

export default BudgetDetailComponent
