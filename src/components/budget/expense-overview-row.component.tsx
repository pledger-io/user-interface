import { mdiContentSave, mdiDotsVertical, mdiSquareEditOutline } from "@mdi/js";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import BudgetRepository, { ComputedExpense } from "../../core/repositories/budget.repository";
import { BudgetExpense } from "../../core/types";
import NotificationService from "../../service/notification.service";
import { Form, Input, SubmitButton } from "../form";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import { Dropdown } from "../layout/dropdown";
import Loading from "../layout/loading.component";
import { Dialog } from "../layout/popup";

import { PopupCallbacks } from "../layout/popup/popup.component";

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
    }, [month, year]);

    const editControl: PopupCallbacks = { open: () => undefined, close: () => undefined }
    const onSubmit = (values: any) => {
        const patch = {
            expenseId: expense.id,
            name: expense.name,
            amount: values.expected
        }

        BudgetRepository.expense(patch)
            .then(() => NotificationService.success('page.budget.group.expense.updated'))
            .then(editControl.close)
            .then(onChanges)
            .catch((error: AxiosError) => NotificationService.exception(error))
    }

    const dropDownActions = { close: () => undefined }
    const isCurrentMonth = currentMonth.isSame(year, month)
    if (!computed) return <tr><td colSpan={ 5 }><Loading /></td></tr>
    return <tr onMouseLeave={ () => dropDownActions.close() }>
        <td> { expense.name } </td>
        <td>
            <MoneyComponent money={ expense.expected }/>
        </td>
        <td>
            <div className='flex gap-2'>
                <MoneyComponent money={ computed.spent }/>
                <span>(<MoneyComponent money={ computed.dailySpent }/>)</span>
            </div>
        </td>
        <td className='hidden md:table-cell'>
            <div className='flex gap-2'>
                <MoneyComponent money={ computed.left }/>
                <span>(<MoneyComponent money={ computed.dailyLeft }/>)</span>
            </div>
        </td>
        <td>
            { isCurrentMonth && <Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                <Form entity='Budget' onSubmit={ onSubmit }>
                    <Dialog title='common.action.edit'
                                   className='Large'
                                   control={ editControl }
                                   actions={ [
                                       <SubmitButton label='common.action.save'
                                                     icon={ mdiContentSave }
                                                     key='update-button'/>,
                                   ] }
                                   openButton={ <Button label='common.action.edit'
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
                    </Dialog>
                </Form>
            </Dropdown> }
        </td>
    </tr>
}

export default ExpenseOverviewRowComponent