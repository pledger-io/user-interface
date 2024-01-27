import ProcessRepository, {
    BusinessKey,
    ProcessInstance,
    ProcessVariable
} from "../../../core/repositories/process.repository";
import React, { useEffect, useState } from "react";
import { Buttons, Formats, Layout, Notifications, Translations } from "../../../core";
import { mdiContentSaveSettings, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import { ConfirmPopup, Dialog } from "../../../core/popups";
import { Form, Input, SubmitButton } from "../../../core/form";
import { ReconcileStart } from "./types";
import { Identifier } from "../../../core/types";

const ReconcilePreviousYearComponent = ({ accountId, year, endBalance, onComplete } : { accountId: Identifier, year : number, endBalance: number, onComplete : () => void }) => {

    const dialogActions = { close: () => undefined }
    const onFormSubmit = (data : any) => {
        const processData : ReconcileStart = {
            businessKey: accountId as BusinessKey,
            accountId: accountId,
            openBalance: data.openBalance,
            endBalance: endBalance,
            startDate: `${year}-01-01`,
            endDate: `${year + 1}-01-01`,
        }

        ProcessRepository.start('AccountReconcile', processData)
            .then(() => Notifications.Service.success('page.accounts.reconcile.success'))
            .then(() => dialogActions.close())
            .then(() => setTimeout(onComplete, 500))
            .catch(() => Notifications.Service.warning('page.accounts.reconcile.error'))
    }

    return <>
        <Form entity='Account' onSubmit={ onFormSubmit }>
            <Dialog title='page.accounts.reconcile.previous'
                    openButton={
                        <Buttons.Button variant='icon' icon={ mdiHammer }
                                        className='text-primary'/>
                    }
                    actions={ [
                        <SubmitButton label='common.action.save' icon={ mdiContentSaveSettings }/>,
                    ] }
                    control={ dialogActions }>

                <Input.Text id='year' title='common.year' type='text' value={ year } readonly />
                <Input.Amount id='openBalance'
                              title='page.accounts.reconcile.openBalance'
                              required={ true } />

                <Input.Amount id='endBalance'
                              value={ endBalance }
                              title='page.accounts.reconcile.endBalance'
                              readonly />
            </Dialog>
        </Form>
    </>
}

const ReconcileRowComponent = ({ process, onRemoved } : { process : ProcessInstance, onRemoved : () => void }) => {
    const [variables, setVariables] = useState<ProcessVariable[]>()

    useEffect(() => {
        ProcessRepository.variables('AccountReconcile', process.businessKey, process.id)
            .then(setVariables)
    }, [process])

    if (!variables) {
        return <tr><td colSpan={ 6 }><Layout.Loading /></td></tr>
    }

    const onRetry = () => {
        setVariables(undefined)
        ProcessRepository.tasks('AccountReconcile', process.businessKey, process.id)
            .then(tasks =>
                Promise.all(tasks.map(task =>
                    ProcessRepository.completeTask('AccountReconcile', process.businessKey, process.id, task.id))))
            .then(() => setTimeout(onRemoved, 20))
            .catch(() => Notifications.Service.warning('page.accounts.reconcile.error'))
    }
    const onDelete = () => {
        ProcessRepository.delete('AccountReconcile', process.businessKey, process.id)
            .then(() => Notifications.Service.success('page.account.reconcile.delete.success'))
            .then(() => onRemoved())
            .catch(() => Notifications.Service.warning('page.account.reconcile.delete.failed'))
    }

    const findValue = (name: string) => variables.find(variable => variable.name === name)?.value

    const year = parseInt(findValue('startDate')?.substring(0, 4))
    const computedStartBalance = parseFloat(findValue('computedStartBalance'))
    const desiredStartBalance = parseFloat(findValue('openBalance'))
    return <>
        <tr>
            <td className='flex gap-0.5'>
                <ReconcilePreviousYearComponent year={ year - 1 }
                                                endBalance={ desiredStartBalance }
                                                accountId={ parseInt(process.businessKey) }
                                                onComplete={ onRemoved } />
                <Buttons.Button variant='icon' icon={ mdiRedo } className='text-success' onClick={ onRetry }/>
                <ConfirmPopup title='page.accounts.reconcile.delete.confirm'
                              openButton={ <Buttons.Button variant='icon' icon={ mdiDelete } className='text-warning' /> }
                              onConfirm={ onDelete }>
                    <Translations.Translation label='page.accounts.reconcile.delete.confirm' />
                </ConfirmPopup>
            </td>
            <td>{ findValue('startDate').substring(0, 4) }</td>
            <td><Formats.Money money={ desiredStartBalance } /></td>
            <td><Formats.Money money={ computedStartBalance } /></td>
            <td><Formats.Money money={ findValue('endBalance') } /></td>
            <td><Formats.Money money={ findValue('computedEndBalance') } /></td>
            <td></td>
        </tr>
    </>
}

export default ReconcileRowComponent