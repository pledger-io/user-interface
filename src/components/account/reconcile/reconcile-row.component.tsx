import { mdiContentSaveSettings, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import React, { useEffect, useState } from "react";
import ProcessRepository, {
    BusinessKey,
    ProcessInstance,
    ProcessVariable
} from "../../../core/repositories/process.repository";
import { Identifier } from "../../../types/types";
import NotificationService from "../../../service/notification.service";
import { Form, Input, SubmitButton } from "../../form";
import MoneyComponent from "../../format/money.component";
import { Button } from "../../layout/button";
import Loading from "../../layout/loading.component";
import { Confirm, Dialog } from "../../layout/popup";

import { PopupCallbacks } from "../../layout/popup/popup.component";
import Translation from "../../localization/translation.component";
import { ReconcileStart } from "./types";

const ReconcilePreviousYearComponent = ({ accountId, year, endBalance, onComplete }: {
    accountId: Identifier,
    year: number,
    endBalance: number,
    onComplete: () => void
}) => {

    const dialogActions: PopupCallbacks = {
        close: () => {
        }, open: () => {
        }
    }
    const onFormSubmit = (data: any) => {
        const processData: ReconcileStart = {
            businessKey: accountId as BusinessKey,
            accountId: accountId,
            openBalance: data.openBalance,
            endBalance: endBalance,
            startDate: `${ year }-01-01`,
            endDate: `${ year + 1 }-01-01`,
        }

        ProcessRepository.start('AccountReconcile', processData)
            .then(() => NotificationService.success('page.accounts.reconcile.success'))
            .then(() => dialogActions.close())
            .then(() => setTimeout(onComplete, 500))
            .catch(() => NotificationService.warning('page.accounts.reconcile.error'))
    }

    return <Form entity='Account' onSubmit={ onFormSubmit }>
        <Dialog title='page.accounts.reconcile.previous'
                openButton={
                    <Button variant='icon' icon={ mdiHammer }
                            className='text-primary'/>
                }
                actions={ [
                    <SubmitButton key='save-btn' label='common.action.save' icon={ mdiContentSaveSettings }/>,
                ] }
                control={ dialogActions }>

            <Input.Text id='year' title='common.year' type='text' value={ year } readonly/>
            <Input.Amount id='openBalance'
                          title='page.accounts.reconcile.openBalance'
                          required={ true }/>

            <Input.Amount id='endBalance'
                          value={ endBalance }
                          title='page.accounts.reconcile.endBalance'
                          readonly/>
        </Dialog>
    </Form>
}

const ReconcileRowComponent = ({ process, onRemoved }: { process: ProcessInstance, onRemoved: () => void }) => {
    const [variables, setVariables] = useState<ProcessVariable[]>()

    useEffect(() => {
        ProcessRepository.variables('AccountReconcile', process.businessKey, process.id)
            .then(setVariables)
    }, [process])

    if (!variables) {
        return <tr>
            <td colSpan={ 6 }><Loading/></td>
        </tr>
    }

    const onRetry = () => {
        setVariables(undefined)
        ProcessRepository.tasks('AccountReconcile', process.businessKey, process.id)
            .then(tasks =>
                Promise.all(tasks.map(task =>
                    ProcessRepository.completeTask('AccountReconcile', process.businessKey, process.id, task.id))))
            .then(() => setTimeout(onRemoved, 20))
            .catch(() => NotificationService.warning('page.accounts.reconcile.error'))
    }
    const onDelete = () => {
        ProcessRepository.delete('AccountReconcile', process.businessKey, process.id)
            .then(() => NotificationService.success('page.account.reconcile.delete.success'))
            .then(() => onRemoved())
            .catch(() => NotificationService.warning('page.account.reconcile.delete.failed'))
    }

    const findValue = (name: string) => variables.find(variable => variable.name === name)?.value

    const year = parseInt(findValue('startDate')?.substring(0, 4))
    const computedStartBalance = parseFloat(findValue('computedStartBalance'))
    const desiredStartBalance = parseFloat(findValue('openBalance'))
    return <tr>
        <td className='flex gap-0.5'>
            <ReconcilePreviousYearComponent year={ year - 1 }
                                            endBalance={ desiredStartBalance }
                                            accountId={ parseInt(process.businessKey) }
                                            onComplete={ onRemoved }/>
            <Button variant='icon'
                    icon={ mdiRedo }
                    className='text-success'
                    onClick={ onRetry }
                    dataTestId={ `retry-button-${ process.id }` }/>
            <Confirm title='page.accounts.reconcile.delete.confirm'
                     openButton={ <Button variant='icon'
                                          key={ `remove-row-${ process.id }` }
                                          icon={ mdiDelete }
                                          dataTestId={ `remove-row-${ process.id }` }
                                          className='text-warning'/> }
                     onConfirm={ onDelete }>
                <Translation label='page.accounts.reconcile.delete.confirm'/>
            </Confirm>
        </td>
        <td>{ findValue('startDate').substring(0, 4) }</td>
        <td><MoneyComponent money={ desiredStartBalance }/></td>
        <td><MoneyComponent money={ computedStartBalance }/></td>
        <td><MoneyComponent money={ findValue('endBalance') }/></td>
        <td><MoneyComponent money={ findValue('computedEndBalance') }/></td>
        <td></td>
    </tr>
}

export default ReconcileRowComponent