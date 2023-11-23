import SavingsRepository from "../../core/repositories/savings-repository";
import {Form, Input, SubmitButton} from "../../core/form";
import {Dialog} from "../../core";
import {mdiContentSave} from "@mdi/js";
import React from "react";
import {Account, SavingGoal} from "../../core/types";

type EditSavingGoalComponentProps = {
    account: Account,
    savingGoal?: SavingGoal,
    onChanged: (_: Account) => void,
    openButton: React.ReactElement
}

const EditSavingGoalComponent = ({account, savingGoal = undefined, onChanged = _ => {}, openButton} : EditSavingGoalComponentProps) => {
    const control = {
        close: () => undefined
    }
    const onSubmit = (entity: any) => {
        if (savingGoal) {
            SavingsRepository.update(account.id, savingGoal.id, entity)
                .then(updatedAccount => onChanged(updatedAccount))
                .then(control.close)
        } else {
            SavingsRepository.create(account.id, entity)
                .then(updatedAccount => onChanged(updatedAccount))
                .then(control.close)
        }
    }

    return <>
        <Form onSubmit={onSubmit} entity='SavingGoal'>
            <Dialog.Dialog title='page.account.savings.new'
                           className='Large'
                           control={control}
                           actions={[
                               <SubmitButton icon={mdiContentSave}
                                             label='common.action.save' />
                           ]}
                           openButton={ openButton }>

                <Input.Text id='name'
                            type='text'
                            required={ true }
                            value={ savingGoal?.name }
                            title='SavingGoal.name' />

                <Input.Amount id='goal'
                              currency={ account.account.currency }
                              value={ savingGoal?.goal || 0 }
                              required={ true }
                              title='SavingGoal.goal' />

                <Input.Date id='targetDate'
                            required={ true }
                            value={ savingGoal?.targetDate }
                            title='SavingGoal.targetDate' />
            </Dialog.Dialog>
        </Form>
    </>
}

export default EditSavingGoalComponent