import { mdiCancel, mdiContentSave, mdiPlus } from "@mdi/js";
import { AxiosError } from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { i10n } from "../../config/prime-locale";
import BudgetRepository, { ComputedExpense } from "../../core/repositories/budget.repository";
import NotificationService from "../../service/notification.service";
import DateRange from "../../types/date-range.type";
import { Budget, BudgetExpense, Identifier } from "../../types/types";
import { Form, Input, SubmitButton } from "../form";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import Loading from "../layout/loading.component";
import Translation from "../localization/translation.component";
import ExpenseActions from "./budget-expense-actions.component";

const AddExpenseDialog = ({ onChange }: { onChange: () => void }) => {
  const [visible, setVisible] = useState(false)

  const onSubmit = (values: any) => {
    const patch = {
      name: values.name,
      amount: values.expected
    }

    BudgetRepository.expense(patch)
      .then(() => NotificationService.success('page.budget.group.expense.added'))
      .then(() => setVisible(false))
      .then(onChange)
      .catch((error: AxiosError) => NotificationService.exception(error))
  }

  return <>
    <Button severity='success' label='page.budget.group.action.addExpense' icon={ mdiPlus } onClick={ () => setVisible(true) }/>
    <Dialog header={ i10n('page.title.budget.group.expense.add') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='Budget' onSubmit={ onSubmit }>
        <Input.Text id='name'
                    required
                    type='text'
                    title='Budget.Expense.name'/>
        <Input.Amount id='expected'
                      min={ 1 }
                      required
                      title='page.budget.group.expense.budgeted'/>

        <div className='flex justify-end gap-2 mt-2'>
          <Button type='reset'
                  text
                  onClick={ () => setVisible(false) }
                  label='common.action.cancel' icon={ mdiCancel } />
          <SubmitButton label='common.action.save' icon={ mdiContentSave } />
        </div>
      </Form>

    </Dialog>
  </>
}

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
    <div className='flex flex-col mb-4'>
      <div className='flex'>
        <Translation label='page.budget.group.budget.period'
                     className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
        <span className='flex gap-1'>
          <span>{ i10n(`common.month.${ range.month() }`) }</span>
          { range.year() }
        </span>
      </div>
      <div className='flex'>
        <Translation label='Budget.expectedIncome'
                     className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>

        <MoneyComponent money={ budget?.income }/>
      </div>
      <div className='flex'>
        <Translation label='page.budget.group.expectedExpenses'
                     className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
        <MoneyComponent money={ budget?.expenses
          .map(expense => expense.expected)
          .reduce((l, r) => l + r, 0) }/>
      </div>
    </div>

    <DataTable value={ budget.expenses } loading={ !budget }>
      <Column field='name' header={ i10n('Budget.Expense.name') }/>
      <Column body={ (expense: BudgetExpense) => <MoneyComponent money={ expense.expected }/> }
              header={ i10n('page.budget.group.expense.budgeted') }/>
      <Column body={ (expense: BudgetExpense) => <MoneyComponent money={ getComputedExpense(expense.id)?.computed.spent }/> }
              header={ i10n('page.budget.group.expense.spent') }/>
      <Column body={ (expense: BudgetExpense) => <MoneyComponent money={ getComputedExpense(expense.id)?.computed.left }/> }
              header={ i10n('page.budget.group.expense.left') }/>
      <Column className='w-[2rem]'
              body={ (expense: BudgetExpense) => <ExpenseActions expense={ expense } callback={ loadBudget } /> }/>
    </DataTable>

    <div className='flex justify-end mt-4'>
      { currentMonth.isSame(range.year(), range.month()) && <AddExpenseDialog onChange={ loadBudget }/> }
    </div>
  </>
}

export default BudgetDetailComponent
