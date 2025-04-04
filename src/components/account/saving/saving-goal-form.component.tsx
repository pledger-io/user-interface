import { mdiCancel, mdiContentSaveSettings } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { FC, Ref, useImperativeHandle } from "react";
import { i10n } from "../../../config/prime-locale";
import SavingsRepository from "../../../core/repositories/savings-repository";
import { Account, SavingGoal } from "../../../types/types";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";

type EditSavingGoalComponentProps = {
  account: Account,
  savingGoal?: SavingGoal,
  onChanged: (_: Account) => void,
  ref: Ref<any>
}

const EditSavingGoalComponent: FC<EditSavingGoalComponentProps> = ({
                                                                     ref,
                                                                     account,
                                                                     savingGoal = undefined,
                                                                     onChanged
                                                                   }) => {
  const [visible, setVisible] = React.useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (entity: any) => {
    if (savingGoal) {
      SavingsRepository.update(account.id, savingGoal.id, entity)
        .then(updatedAccount => onChanged(updatedAccount))
        .then(() => setVisible(false))
    } else {
      SavingsRepository.create(account.id, entity)
        .then(updatedAccount => onChanged(updatedAccount))
        .then(() => setVisible(false))
    }
  }
  const minDate = new Date()

  return <Dialog header={ i10n('page.account.savings.new') }
                 visible={ visible }
                 onHide={ () => setVisible(false) }>
    <Form onSubmit={ onSubmit } entity='SavingGoal'>
      <Input.Text id='name'
                  type='text'
                  required={ true }
                  value={ savingGoal?.name }
                  title='SavingGoal.name'/>

      <Input.Amount id='goal'
                    currency={ account.account.currency }
                    value={ savingGoal?.goal ?? 0 }
                    required={ true }
                    title='SavingGoal.goal'/>

      <Input.Date id='targetDate'
                  required={ true }
                  minDate={ minDate }
                  value={ savingGoal?.targetDate }
                  title='SavingGoal.targetDate'/>

      <div className='flex gap-1 justify-end mt-4'>
        <Button label='common.action.cancel'
                type='reset'
                severity='secondary'
                text
                onClick={() => setVisible(false)}
                icon={mdiCancel}/>
        <SubmitButton key='save-btn' label='common.action.save' icon={mdiContentSaveSettings}/>
      </div>
    </Form>
  </Dialog>
}

export default EditSavingGoalComponent
