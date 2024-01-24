import ProcessRepository, { BusinessKey, ProcessStart } from "../../core/repositories/process.repository";
import { Account, Identifier } from "../../core/types";
import { Buttons, Notifications } from "../../core";
import { Form, Input, SubmitButton } from "../../core/form";
import { Dialog } from "../../core/popups";
import { mdiCheck, mdiContentSave } from "@mdi/js";
import React from "react";

type ReconcileStart = ProcessStart & {
    accountId: Identifier
    openBalance: number
    endBalance: number
    startDate: string
    endDate: string
}

const ReconcilePopup = ({ account }: { account : Account }) => {
    const dialogActions = { close: () => undefined }
    const onSubmit = (data: any) => {
        const processData : ReconcileStart = {
            businessKey: account.id as BusinessKey,
            accountId: account.id,
            openBalance: data.openBalance,
            endBalance: data.endBalance,
            startDate: `${data.year}-01-01`,
            endDate: `${data.year}-12-31`,
        }

        ProcessRepository.start('AccountReconcile', processData)
            .then(() => Notifications.Service.success('page.accounts.reconcile.success'))
            .then(() => dialogActions.close())
            .catch(() => Notifications.Service.warning('page.accounts.reconcile.error'))
    }

    return <>
        <Form entity='Account' onSubmit={ onSubmit }>
            <Dialog title='page.accounts.reconcile.create'
                    className='Large'
                    control={ dialogActions }
                    actions={ [
                        <SubmitButton label='common.action.save' icon={ mdiContentSave }/>,
                    ] }
                    openButton={
                        <Buttons.Button label='page.reports.default.reconcile' className='!py-2' icon={ mdiCheck }/>
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