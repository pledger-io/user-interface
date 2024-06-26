import SavingsRepository from "../../core/repositories/savings-repository";
import { Form, Input, SubmitButton } from "../../core/form";
import { Buttons, Dialog } from "../../core";
import { mdiPlusBox } from "@mdi/js";
import React from "react";
import { Account, SavingGoal } from "../../core/types";
import { PopupCallbacks } from "../../components/layout/popup/popup.component";

type ReserveToGoalComponentProps = {
    account: Account,
    savingGoal: SavingGoal,
    onChanged: (_: Account) => void
}

const ReserveToGoalComponent = ({ account, savingGoal, onChanged } : ReserveToGoalComponentProps) => {
    const control: PopupCallbacks = { close: () => undefined, open: () => undefined }

    const onSubmit = (e: any) => SavingsRepository.assign(account.id, savingGoal.id, e.amount)
        .then(updatedAccount => onChanged(updatedAccount))
        .then(control.close)

    return <>
        <Form onSubmit={ onSubmit } entity='SavingGoal'>
            <Dialog.Dialog className='AddToSavings'
                           title='dialog.savings.assign.to.goal'
                           control={ control }
                           actions={ [
                               <SubmitButton label='dialog.savings.assign.action'
                                             icon={ mdiPlusBox }
                                             variant='success'
                                             key='addToSavingGoal'/>
                           ] }
                           openButton={ <Buttons.Button icon={ mdiPlusBox }
                                                        variant='icon'/> }>
                <Input.Text id='amount'
                            type='number'
                            required={ true }
                            min={ 0 } />
            </Dialog.Dialog>
        </Form>
    </>
}

export default ReserveToGoalComponent