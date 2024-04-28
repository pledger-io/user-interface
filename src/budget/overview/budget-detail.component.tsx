import { Range } from "../../core/Dates";
import { Budget } from "../../core/types";
import React, { useEffect, useState } from "react";
import BudgetRepository from "../../core/repositories/budget.repository";
import { Buttons, Dialog, Formats, Layout, Notifications, Translations } from "../../core";
import ExpenseOverviewComponent from "./expense-overview.component";
import { Form, Input, SubmitButton } from "../../core/form";
import { mdiContentSave, mdiPlus } from "@mdi/js";
import { AxiosError } from "axios";

const AddExpenseDialog = ({ onChange }: { onChange : () => void }) => {
    const editControl = { close: () => undefined }

    const onSubmit = (values: any) => {
        const patch = {
            name: values.name,
            amount: values.expected
        }

        BudgetRepository.expense(patch)
            .then(() => Notifications.Service.success('page.budget.group.expense.added'))
            .then(editControl.close)
            .then(onChange)
            .catch((error: AxiosError) => Notifications.Service.exception(error))
    }

    return <Form entity='Budget' onSubmit={ onSubmit }>
        <Dialog.Dialog title='page.title.budget.group.expense.add'
                       className='Large'
                       control={ editControl }
                       actions={ [
                           <SubmitButton label='common.action.save'
                                         icon={ mdiContentSave }
                                         key='update-button'/>,
                       ] }
                       openButton={ <Buttons.Button label='page.budget.group.action.addExpense' icon={ mdiPlus }/> }>

            <Input.Text id='name'
                        required
                        type='text'
                        title='Budget.Expense.name'/>
            <Input.Amount id='expected'
                          min={ 1 }
                          required
                          title='page.budget.group.expense.budgeted'/>
        </Dialog.Dialog>
    </Form>
}

const currentMonth = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isSame: (year: number, month: number) => year === currentMonth.year && month === currentMonth.month
}


const BudgetDetailComponent = ({ range }: { range: Range }) => {
    const [budget, setBudget] = useState<Budget>()

    const loadBudget = () => {
        BudgetRepository.budgetMonth(range.year(), range.month())
            .then(setBudget)
            .catch(console.error)
    }
    useEffect(loadBudget, [range]);

    if (!budget) return <Layout.Loading />
    return <>
        <div className='flex flex-col'>
            <div className='flex'>
                <Translations.Translation label='page.budget.group.budget.period'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
                <span>
                    <Translations.Translation label={`common.month.${range.month()}`} className='mr-1' />
                    { range.year() }
                </span>
            </div>
            <div className='flex'>
                <Translations.Translation label='Budget.expectedIncome'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>

                <Formats.Money money={ budget?.income } />
            </div>
            <div className='flex'>
                <Translations.Translation label='page.budget.group.expectedExpenses'
                                          className='font-bold mr-2 min-w-[10em] after:content-[":"]'/>
                <Formats.Money money={ budget?.expenses
                    .map(expense => expense.expected)
                    .reduce((l, r) => l + r, 0)} />
            </div>
        </div>

        <ExpenseOverviewComponent budget={ budget }
                                  year={ range.year() }
                                  month={ range.month() }
                                  onChanges={ loadBudget }/>

        <div className='flex justify-end'>
            { currentMonth.isSame(range.year(), range.month()) && <AddExpenseDialog onChange={ loadBudget } /> }
        </div>
    </>
}

export default BudgetDetailComponent