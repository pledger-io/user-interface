import { mdiCheck, mdiContentSave } from "@mdi/js";
import React from "react";
import ProcessRepository, { BusinessKey } from "../../../core/repositories/process.repository";
import { Account } from "../../../core/types";
import NotificationService from "../../../service/notification.service";
import { Form, Input, SubmitButton } from "../../form";
import { Button } from "../../layout/button";
import { Dialog } from "../../layout/popup";
import { PopupCallbacks } from "../../layout/popup/popup.component";
import { ReconcileStart } from "./types";

const ReconcilePopup = ({ account, afterCreate }: { account: Account, afterCreate: () => void }) => {
    const dialogActions: PopupCallbacks = { close: () => undefined, open: () => undefined }
    const onSubmit = (data: any) => {
        const processData: ReconcileStart = {
            businessKey: account.id as BusinessKey,
            accountId: account.id,
            openBalance: data.openBalance,
            endBalance: data.endBalance,
            startDate: `${ data.year }-01-01`,
            endDate: `${ parseInt(data.year) + 1 }-01-01`,
        }

        ProcessRepository.start('AccountReconcile', processData)
            .then(() => NotificationService.success('page.accounts.reconcile.success'))
            .then(() => dialogActions.close())
            .then(() => setTimeout(afterCreate, 500))
            .catch(() => NotificationService.warning('page.accounts.reconcile.error'))
    }

    return <>
        <Form entity='Account' onSubmit={ onSubmit }>
            <Dialog title='page.accounts.reconcile.create'
                    className='Large'
                    control={ dialogActions }
                    actions={ [
                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave }
                                      dataTestId={ `reconcile-submit-button-${ account.id }` }/>,
                    ] }
                    openButton={
                        <Button label='page.reports.default.reconcile'
                                className='!py-2'
                                icon={ mdiCheck }
                                dataTestId={ `reconcile-open-button-${ account.id }` }/>
                    }>

                <Input.Text title='page.accounts.reconcile.account'
                            id='name'
                            type='text'
                            readonly
                            value={ account.name }/>

                <Input.Text title='common.year'
                            id='year'
                            type='text'/>

                <Input.Amount title='page.accounts.reconcile.openBalance'
                              id='openBalance'/>

                <Input.Amount title='page.accounts.reconcile.endBalance'
                              id='endBalance'/>
            </Dialog>
        </Form>
    </>
}

export default ReconcilePopup