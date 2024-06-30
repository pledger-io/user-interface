import { mdiBagChecked } from "@mdi/js";
import React, { useEffect, useState } from "react";
import Message from "../../../components/layout/message.component";
import ProcessRepository, { BusinessKey, ProcessInstance } from "../../../core/repositories/process.repository";
import { Identifier } from "../../../core/types";
import { Button } from "../../layout/button";
import Loading from "../../layout/loading.component";
import { Dialog } from "../../layout/popup";
import Translation from "../../localization/translation.component";

import ReconcileRowComponent from "./reconcile-row.component";

const ReconcileOverviewComponent = ({ accountId, onRemoved }: { accountId: Identifier, onRemoved: () => void }) => {
    const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>()

    const loadReconcileActivity = () => {
        setReconcileActivity(undefined)
        ProcessRepository.historyForKey('AccountReconcile', accountId as BusinessKey)
            .then(processes => processes.filter(process => process.state === 'ACTIVE'))
            .then(setReconcileActivity)
    }
    useEffect(loadReconcileActivity, [accountId])
    useEffect(() => {
        if (reconcileActivity && reconcileActivity.length === 0) {
            onRemoved()
        }
    }, [reconcileActivity, onRemoved])

    return <>
        <Dialog title='page.accounts.reconcile.active'
                className='Large'
                openButton={
                    <Button label='page.accounts.reconcile.active' icon={ mdiBagChecked }/>
                }>

            <Message label='page.accounts.reconcile.active.explained'/>

            <table className='Table'>
                <thead>
                <tr>
                    <th rowSpan={ 2 } className='w-4'/>
                    <th rowSpan={ 2 }>
                        <Translation label='common.year'/>
                    </th>
                    <th colSpan={ 2 }>
                        <Translation label='common.start'/>
                    </th>
                    <th colSpan={ 2 }>
                        <Translation label='common.end'/>
                    </th>
                </tr>
                <tr>
                    <th><Translation label='common.expected'/></th>
                    <th><Translation label='common.actual'/></th>
                    <th><Translation label='common.expected'/></th>
                    <th><Translation label='common.actual'/></th>
                </tr>
                </thead>
                <tbody>
                { !reconcileActivity && <tr>
                    <td colSpan={ 6 }><Loading/></td>
                </tr> }
                { reconcileActivity && reconcileActivity.map(process =>
                    <ReconcileRowComponent process={ process } onRemoved={ loadReconcileActivity }/>) }
                </tbody>
            </table>

        </Dialog>
    </>
}

export default ReconcileOverviewComponent