import { mdiCancel, mdiContentSaveSettings } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { Ref, useImperativeHandle } from "react";
import { i10n } from "../../../config/prime-locale";
import SavingsRepository from "../../../core/repositories/savings-repository";
import { Account, DialogOptions, SavingGoal } from "../../../types/types";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";

type ReserveToGoalComponentProps = {
  account: Account,
  savingGoal: SavingGoal,
  onChanged: (_: Account) => void,
  ref: Ref<DialogOptions>
}

const ReserveToGoalComponent = ({ ref, account, savingGoal, onChanged }: ReserveToGoalComponentProps) => {
  const [visible, setVisible] = React.useState(false);
  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (e: any) => SavingsRepository.assign(account.id, savingGoal.id, e.amount)
    .then(updatedAccount => onChanged(updatedAccount))
    .then(() => setVisible(false))

  return <Dialog header={ i10n('dialog.savings.assign.to.goal') }
                 visible={ visible }
                 onHide={ () => setVisible(false) }>
    <Form onSubmit={ onSubmit } entity='SavingGoal'>
      <Input.Amount id='amount'
                    title='Transaction.amount'
                    required={ true }
                    min={ 0 }/>

      <div className='flex gap-1 justify-end mt-4'>
        <Button label='common.action.cancel'
                type='reset'
                severity='secondary'
                text
                onClick={ () => setVisible(false) }
                icon={ mdiCancel }/>
        <SubmitButton key='save-btn' label='dialog.savings.assign.action' icon={ mdiContentSaveSettings }/>
      </div>
    </Form>
  </Dialog>
}

export default ReserveToGoalComponent
