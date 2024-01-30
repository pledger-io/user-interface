import ProcessRepository, { BusinessKey } from "../../../core/repositories/process.repository";
import { Account } from "../../../core/types";
import { Buttons, Notifications } from "../../../core";
import { Form, Input, SubmitButton } from "../../../core/form";
import { Dialog } from "../../../core/popups";
import { ReconcileStart } from "./types";
import { mdiCheck, mdiContentSave } from "@mdi/js";
import React from "react";

const ReconcilePopup = ({ account, afterCreate }: { account : Account, afterCreate : () => void }) => {
    const dialogActions = { close: () => undefined }
    const onSubmit = (data: any) => {
        const processData : ReconcileStart = {
            businessKey: account.id as BusinessKey,
            accountId: account.id,
            openBalance: data.openBalance,
            endBalance: data.endBalance,
            startDate: `${data.year}-01-01`,
            endDate: `${parseInt(data.year) + 1}-01-01`,
        }

        ProcessRepository.start('AccountReconcile', processData)
            .then(() => Notifications.Service.success('page.accounts.reconcile.success'))
            .then(() => dialogActions.close())
            .then(() => setTimeout(afterCreate, 500))
            .catch(() => Notifications.Service.warning('page.accounts.reconcile.error'))
    }

    return <>
        <Form entity='Account' onSubmit={ onSubmit }>
            <Dialog title='page.accounts.reconcile.create'
                    className='Large'
                    control={ dialogActions }
                    actions={ [
                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave }
                                      dataTestId={`reconcile-submit-button-${ account.id }`}/>,
                    ] }
                    openButton={
                        <Buttons.Button label='page.reports.default.reconcile'
                                        className='!py-2'
                                        icon={ mdiCheck }
                                        dataTestId={`reconcile-open-button-${ account.id }`}/>
                    }>

                <Input.Text title='page.accounts.reconcile.account'
                            id='name'
                            type='text'
                            readonly
                            value={ account.name }/>

                <Input.Text title='common.year'
                            id='year'
                            type='text' />

                <Input.Amount title='page.accounts.reconcile.openBalance'
                              id='openBalance' />

                <Input.Amount title='page.accounts.reconcile.endBalance'
                              id='endBalance' />
            </Dialog>
        </Form>
    </>
}

export default ReconcilePopup