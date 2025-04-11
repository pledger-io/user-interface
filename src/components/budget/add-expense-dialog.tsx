import { mdiCancel, mdiContentSave, mdiPlus } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import BudgetRepository from "../../core/repositories/budget.repository";
import { Form, Input, SubmitButton } from "../form";
import { Button } from "../layout/button";

export const AddExpenseDialog = ({ onChange }: { onChange: () => void }) => {
  const [visible, setVisible] = useState(false)
  const { success, httpError } = useNotification()

  const onSubmit = (values: any) => {
    const patch = {
      name: values.name,
      amount: values.expected
    }

    BudgetRepository.expense(patch)
      .then(() => success('page.budget.group.expense.added'))
      .then(() => setVisible(false))
      .then(onChange)
      .catch(httpError)
  }

  return <>
    <Button severity='success' label='page.budget.group.action.addExpense' icon={ mdiPlus }
            onClick={ () => setVisible(true) }/>
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
                  label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>

    </Dialog>
  </>
}
