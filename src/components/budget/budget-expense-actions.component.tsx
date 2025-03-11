import { mdiCancel, mdiContentSave, mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { AxiosError } from "axios";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { i10n } from "../../config/prime-locale";
import BudgetRepository from "../../core/repositories/budget.repository";
import NotificationService from "../../service/notification.service";
import { BudgetExpense } from "../../types/types";
import { Form, Input, SubmitButton } from "../form";
import { Button } from "../layout/button";

const ExpenseActions = ({ expense, callback }: { expense: BudgetExpense, callback: () => void }) => {
  const [visible, setVisible] = useState(false)

  const onSubmit = (values: any) => {
    const patch = {
      expenseId: expense.id,
      name: expense.name,
      amount: values.expected
    }

    BudgetRepository.expense(patch)
      .then(() => NotificationService.success('page.budget.group.expense.updated'))
      .then(() => setVisible(false))
      .then(callback)
      .catch((error: AxiosError) => NotificationService.exception(error))
  }

  return <>
    <a onClick={ () => setVisible(true) } className='cursor-pointer text-blue-500'>
      <Icon path={ mdiSquareEditOutline } size={ 1 } />
    </a>

    <Dialog header={ i10n('common.action.edit') }
            visible={ visible }
            onHide={ () => setVisible(false) }>
      <Form entity='Budget' onSubmit={ onSubmit }>
        <Input.Text id='name'
                    type='text'
                    readonly
                    value={ expense.name }
                    title='Budget.Expense.name'/>
        <Input.Amount id='expected'
                      min={ 0 }
                      value={ expense.expected }
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

export default ExpenseActions
