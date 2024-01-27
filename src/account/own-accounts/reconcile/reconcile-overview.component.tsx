import { ConfirmPopup, Dialog } from "../../../core/popups";
import { mdiBagChecked, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import { Buttons, Formats, Layout, Message, Notifications, Translations } from "../../../core";
import React, { useEffect, useState } from "react";
import ProcessRepository, {
    BusinessKey,
    ProcessInstance,
    ProcessVariable
} from "../../../core/repositories/process.repository";
import ReconcileRowComponent from "./reconcile-row.component";
import { Identifier } from "../../../core/types";

const ReconcileOverviewComponent = ({ accountId, onRemoved } : { accountId : Identifier, onRemoved : () => void }) => {
    const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>()

    const loadReconcileActivity = () => {
        setReconcileActivity(undefined)
        ProcessRepository.historyForKey('AccountReconcile', accountId as BusinessKey)
            .then(processes => processes.filter(process => process.state === 'ACTIVE'))
            .then(setReconcileActivity)
    }
    useEffect(loadReconcileActivity, [accountId])
    useEffect(() =>{
        if (reconcileActivity && reconcileActivity.length === 0) {
            onRemoved()
        }
    }, [reconcileActivity])

    return <>
        <Dialog title='page.accounts.reconcile.active'
                className='Large'
                openButton={
                    <Buttons.Button label='page.accounts.reconcile.active' icon={ mdiBagChecked }/>
                }>

            <Message label='page.accounts.reconcile.active.explained' />

            <table className='Table'>
                <thead>
                <tr>
                    <th rowSpan={ 2 } className='w-4' />
                    <th rowSpan={ 2 }>
                        <Translations.Translation label='common.year' />
                    </th>
                    <th colSpan={ 2 }>
                        <Translations.Translation label='common.start' />
                    </th>
                    <th colSpan={ 2 }>
                        <Translations.Translation label='common.end' />
                    </th>
                </tr>
                <tr>
                    <th><Translations.Translation label='common.expected'/></th>
                    <th><Translations.Translation label='common.actual'/></th>
                    <th><Translations.Translation label='common.expected'/></th>
                    <th><Translations.Translation label='common.actual'/></th>
                </tr>
                </thead>
                <tbody>
                { !reconcileActivity && <tr><td colSpan={ 6 }><Layout.Loading /></td></tr> }
                { reconcileActivity && reconcileActivity.map(process =>
                    <ReconcileRowComponent process={ process } onRemoved={ loadReconcileActivity } />) }
                </tbody>
            </table>

        </Dialog>
    </>
}

export default ReconcileOverviewComponent