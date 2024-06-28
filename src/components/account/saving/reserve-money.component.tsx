import SavingsRepository from "../../../core/repositories/savings-repository";
import { mdiPlusBox } from "@mdi/js";
import React from "react";
import { Account, SavingGoal } from "../../../core/types";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";
import { Dialog } from "../../layout/popup";
import { PopupCallbacks } from "../../layout/popup/popup.component";

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
            <Dialog className='AddToSavings'
                           title='dialog.savings.assign.to.goal'
                           control={ control }
                           actions={ [
                               <SubmitButton label='dialog.savings.assign.action'
                                             icon={ mdiPlusBox }
                                             variant='success'
                                             key='addToSavingGoal'/>
                           ] }
                           openButton={ <Button icon={ mdiPlusBox }
                                                        variant='icon'/> }>
                <Input.Text id='amount'
                            type='number'
                            required={ true }
                            min={ 0 } />
            </Dialog>
        </Form>
    </>
}

export default ReserveToGoalComponent