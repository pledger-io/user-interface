import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import React, { FC, useEffect, useImperativeHandle, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import ProcessRepository, { BusinessKey, ProcessInstance } from "../../../core/repositories/process.repository";
import { Identifier } from "../../../types/types";
import Loading from "../../layout/loading.component";
import ReconcileRowComponent from "./reconcile-row.component";

type ReconcileOverviewProps = {
  accountId: Identifier
  onRemoved: () => void
  ref: any
}

const ReconcileOverviewComponent: FC<ReconcileOverviewProps> = ({ ref, accountId, onRemoved }) => {
  const [reconcileActivity, setReconcileActivity] = useState<ProcessInstance[]>()
  const [visible, setVisible] = React.useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

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

  return <Dialog header={ i10n('page.accounts.reconcile.active') }
                 visible={ visible }
                 className='max-w-[40rem]'
                 onHide={ () => setVisible(false) }>

    <Message text={ i10n('page.accounts.reconcile.active.explained') }
             className='max-w-fit'
             severity='info'/>

    <table className='p-datatable-table p-datatable mt-4'>
      <thead className='p-datatable-thead'>
      <tr>
        <th rowSpan={ 2 } className='w-4'/>
        <th rowSpan={ 2 }>
          { i10n('common.year') }
        </th>
        <th colSpan={ 2 }>
          { i10n('common.start') }
        </th>
        <th colSpan={ 2 }>
          { i10n('common.end') }
        </th>
      </tr>
      <tr>
        <th>{ i10n('common.expected') }</th>
        <th>{ i10n('common.actual') }</th>
        <th>{ i10n('common.expected') }</th>
        <th>{ i10n('common.actual') }</th>
      </tr>
      </thead>
      <tbody>
      { !reconcileActivity && <tr>
        <td colSpan={ 6 }><Loading/></td>
      </tr> }
      { reconcileActivity?.map(process =>
        <ReconcileRowComponent key={ process.id } process={ process } onRemoved={ loadReconcileActivity }/>) }
      </tbody>
    </table>

  </Dialog>
}

export default ReconcileOverviewComponent
