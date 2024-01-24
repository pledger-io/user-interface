import ProcessRepository, { BusinessKey, ProcessInstance } from "../../core/repositories/process.repository";
import React, { useEffect, useState } from "react";
import { Account } from "../../core/types";
import ReconcilePopup from "./reconcile-popup.component";
import ReconcileOverviewComponent from "./reconcile-overview.component";


const ReconcileActivityComponent = ({ account }: { account : Account }) => {
    const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>()

    useEffect(() => {
        ProcessRepository.historyForKey('AccountReconcile', account.id as BusinessKey)
            .then(processes => {
                console.log(processes)
                return processes.filter(process => process.state === 'ACTIVE')
            })
            .then(setReconcileActivity)
    }, [account])

    const hasReconcileActivity = reconcileActivity && reconcileActivity.length > 0
    return <>
        { !hasReconcileActivity && <ReconcilePopup account={ account } /> }
        { hasReconcileActivity && <ReconcileOverviewComponent processes={ reconcileActivity }/> }
    </>
}

export default ReconcileActivityComponent