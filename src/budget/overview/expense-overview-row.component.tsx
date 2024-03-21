import { Buttons, Dialog, Dropdown, Formats, Layout, Notifications } from "../../core";
import { BudgetExpense } from "../../core/types";
import React, { useEffect, useState } from "react";
import BudgetRepository, { ComputedExpense } from "../../core/repositories/budget.repository";
import { mdiContentSave, mdiDotsVertical, mdiSquareEditOutline } from "@mdi/js";
import { Form, Input, SubmitButton } from "../../core/form";
import { AxiosError } from "axios";

type ExpenseOverviewRowProps = {
    expense: BudgetExpense,
    year: number,
    month: number,
    onChanges: () => void
}

const currentMonth = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isSame: (year: number, month: number) => year === currentMonth.year && month === currentMonth.month
}

const ExpenseOverviewRowComponent = ({ expense, year, month, onChanges } : ExpenseOverviewRowProps) => {
    const [computed, setComputed] = useState<ComputedExpense>()

    useEffect(() => {
        setComputed(undefined)
        BudgetRepository.compute(expense.id, year, month)
            .then(response => setComputed(response[0]))
            .catch(console.error)
    }, [month, year]); // eslint-disable-line react-hooks/exhaustive-deps

    const editControl = { close: () => undefined }
    const onSubmit = (values: any) => {
        const patch = {
            expenseId: expense.id,
            name: expense.name,
            amount: values.expected
        }

        BudgetRepository.expense(patch)
            .then(() => Notifications.Service.success('page.budget.group.expense.updated'))
            .then(editControl.close)
            .then(onChanges)
            .catch((error: AxiosError) => Notifications.Service.exception(error))
    }

    const dropDownActions = { close: () => undefined }
    const isCurrentMonth = currentMonth.isSame(year, month)
    if (!computed) return <tr><td colSpan={ 5 }><Layout.Loading /></td></tr>
    return <tr onMouseLeave={ () => dropDownActions.close() }>
        <td> { expense.name } </td>
        <td>
            <Formats.Money money={ expense.expected }/>
        </td>
        <td>
            <div className='flex gap-2'>
                <Formats.Money money={ computed.spent }/>
                <span>(<Formats.Money money={ computed.dailySpent }/>)</span>
            </div>
        </td>
        <td>
            <div className='flex gap-2'>
                <Formats.Money money={ computed.left }/>
                <span>(<Formats.Money money={ computed.dailyLeft }/>)</span>
            </div>
        </td>
        <td>
            { isCurrentMonth && <Dropdown.Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                <Form entity='Budget' onSubmit={ onSubmit }>
                    <Dialog.Dialog title='common.action.edit'
                                   className='Large'
                                   control={ editControl }
                                   actions={ [
                                       <SubmitButton label='common.action.save'
                                                     icon={ mdiContentSave }
                                                     key='update-button'/>,
                                   ] }
                                   openButton={ <Buttons.Button label='common.action.edit'
                                                                variant='primary'
                                                                icon={ mdiSquareEditOutline } />}
                                   >

                        <Input.Text id='name'
                                    type='text'
                                    readonly
                                    value={ expense.name }
                                    title='Budget.Expense.name'/>
                        <Input.Amount id='expected'
                                      min={ 0 }
                                      value={ expense.expected }
                                      title='page.budget.group.expense.budgeted'/>
                    </Dialog.Dialog>
                </Form>
            </Dropdown.Dropdown> }
        </td>
    </tr>
}

export default ExpenseOverviewRowComponent