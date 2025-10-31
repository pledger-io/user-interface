import { mdiCancel, mdiContentSaveSettings, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import ProcessRepository, {
  BusinessKey,
  ProcessInstance,
  ProcessVariable
} from "../../../core/repositories/process.repository";
import { Identifier } from "../../../types/types";
import { confirmDeleteDialog } from "../../confirm-dialog";
import { Form, Input, SubmitButton } from "../../form";
import MoneyComponent from "../../format/money.component";
import { Button } from "../../layout/button";
import Loading from "../../layout/loading.component";
import { ReconcileStart } from "./types";

type ReconcilePreviousYearProps = {
  accountId: Identifier
  year: number
  endBalance: number,
  onComplete: () => void,
  ref: Ref<any>
}

const ReconcilePreviousYearComponent: FC<ReconcilePreviousYearProps> = ({
                                                                          ref,
                                                                          accountId,
                                                                          year,
                                                                          endBalance,
                                                                          onComplete
                                                                        }) => {
  const [visible, setVisible] = React.useState(false);
  const { success, warning } = useNotification()

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

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
      .then(() => success('page.accounts.reconcile.success'))
      .then(() => setVisible(false))
      .then(() => setTimeout(onComplete, 500))
      .catch(() => warning('page.accounts.reconcile.error'))
  }

  return <Dialog header={ i10n('page.accounts.reconcile.previous') }
                 visible={ visible }
                 onHide={ () => setVisible(false) }>
    <Form entity='Account' onSubmit={ onFormSubmit }>
      <Input.Text id='year' title='common.year' type='text' value={ year } readonly/>
      <Input.Amount id='openBalance'
                    title='page.accounts.reconcile.openBalance'
                    required={ true }/>

      <Input.Amount id='endBalance'
                    value={ endBalance }
                    title='page.accounts.reconcile.endBalance'
                    readonly/>

      <div className='flex gap-1 justify-end mt-4'>
        <Button label='common.action.cancel'
                type='reset'
                severity='secondary'
                text
                onClick={ () => setVisible(false) }
                icon={ mdiCancel }/>
        <SubmitButton key='save-btn' label='common.action.save' icon={ mdiContentSaveSettings }/>
      </div>
    </Form>
  </Dialog>
}

const ReconcileRowComponent = ({ process, onRemoved }: { process: ProcessInstance, onRemoved: () => void }) => {
  const [variables, setVariables] = useState<ProcessVariable[]>()
  const previousYearRef = useRef<any>(null)
  const { success, warning } = useNotification()

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
      .catch(() => warning('page.accounts.reconcile.error'))
  }
  const onDelete = () => {
    confirmDeleteDialog({
      message: i10n('page.accounts.reconcile.delete.confirm'),
      accept() {
        ProcessRepository.delete('AccountReconcile', process.businessKey, process.id)
          .then(() => success('page.account.reconcile.delete.success'))
          .then(() => onRemoved())
          .catch(() => warning('page.account.reconcile.delete.failed'))
      }
    })
  }

  const findValue = (name: string) => variables.find(variable => variable.name === name)?.value

  const year = parseInt(findValue('startDate')?.substring(0, 4))
  const computedStartBalance = parseFloat(findValue('computedStartBalance'))
  const desiredStartBalance = parseFloat(findValue('openBalance'))
  return <tr>
    <td className='flex gap-0.5'>
      <ReconcilePreviousYearComponent year={ year - 1 }
                                      ref={ previousYearRef }
                                      endBalance={ desiredStartBalance }
                                      accountId={ parseInt(process.businessKey) }
                                      onComplete={ onRemoved }/>
      <Button
        icon={ mdiHammer }
        outlined
        severity='info'
        className='!p-0.5'
        onClick={ () => previousYearRef?.current?.open() }
        data-testid={ `previous-year-button-${ process.id }` }/>
      <Button
        icon={ mdiRedo }
        outlined
        severity='success'
        className='!p-0.5'
        onClick={ onRetry }
        data-testid={ `retry-button-${ process.id }` }/>
      <Button
        icon={ mdiDelete }
        outlined
        severity='warning'
        className='!p-0.5'
        onClick={ onDelete }
        data-testid={ `remove-row-${ process.id }` }/>
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
