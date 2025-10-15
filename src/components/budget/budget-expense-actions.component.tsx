import { mdiCancel, mdiContentSave, mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import BudgetRepository from "../../core/repositories/budget.repository";
import { BudgetExpense } from "../../types/types";
import { Form, Input, SubmitButton } from "../form";
import { Button } from "../layout/button";

const ExpenseActions = ({ expense, callback }: { expense: BudgetExpense, callback: () => void }) => {
  const [visible, setVisible] = useState(false)
  const { success, httpError } = useNotification()

  const onSubmit = (values: any) => {
    const patch = {
      id: expense.id,
      name: expense.name,
      amount: values.expected
    }

    BudgetRepository.expense(patch)
      .then(() => success('page.budget.group.expense.updated'))
      .then(() => setVisible(false))
      .then(callback)
      .catch(httpError)
  }

  return <>
    <a onClick={ () => setVisible(true) } className='cursor-pointer text-gray-400 hover:text-gray-600 with-tooltip' data-pr-tooltip={ i10n('common.action.edit') }>
      <Icon path={ mdiPencil } size={ .8 } />
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
