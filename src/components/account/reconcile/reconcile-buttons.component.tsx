import ProcessRepository, { BusinessKey, ProcessInstance } from "../../../core/repositories/process.repository";
import React, { useEffect, useState } from "react";
import { Account } from "../../../core/types";
import ReconcilePopup from "./reconcile-start.component";
import ReconcileOverviewComponent from "./reconcile-overview.component";


const ReconcileButtonsComponent = ({ account }: { account : Account }) => {
    const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>()

    const loadReconcileActivity = () => {
        ProcessRepository.historyForKey('AccountReconcile', account.id as BusinessKey)
            .then(processes => processes.filter(process => process.state === 'ACTIVE'))
            .then(setReconcileActivity)
    }
    useEffect(loadReconcileActivity, [account])

    const hasReconcileActivity = reconcileActivity && reconcileActivity.length > 0
    return <>
        { !hasReconcileActivity && <ReconcilePopup account={ account } afterCreate={ loadReconcileActivity }/> }
        { hasReconcileActivity && <ReconcileOverviewComponent accountId={ account.id }
                                                              onRemoved={ loadReconcileActivity }/> }
    </>
}

export default ReconcileButtonsComponent