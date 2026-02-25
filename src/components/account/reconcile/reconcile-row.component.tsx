import { mdiCancel, mdiContentSaveSettings, mdiDelete, mdiHammer, mdiRedo } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { FC, Ref, useImperativeHandle, useRef } from "react";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import AccountRepository from "../../../core/repositories/account-repository";
import { AccountReconcile, Identifier } from "../../../types/types";
import { Form, Input, SubmitButton } from "../../form";
import MoneyComponent from "../../format/money.component";
import { Button } from "../../layout/button";

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
    const processData = {
      balance: {
        start: data.openBalance,
        end: data.endBalance
      },
      period: year
    }

    AccountRepository.yearReconcile(accountId, processData)
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

const ReconcileRowComponent = ({ process, onRemoved, accountId }: { process: AccountReconcile, onRemoved: () => void, accountId: Identifier}) => {
  const previousYearRef = useRef<any>(null)
  const { warning } = useNotification()

  const onRetry = () => {
    AccountRepository.yearReconcile(accountId, process)
      .then(() => setTimeout(onRemoved, 20))
      .catch(() => warning('page.accounts.reconcile.error'))
  }

  const onDelete = () => {
    // confirmDeleteDialog({
    //   message: i10n('page.accounts.reconcile.delete.confirm'),
    //   accept() {
    //     ProcessRepository.delete('AccountReconcile', process.businessKey, process.id)
    //       .then(() => success('page.account.reconcile.delete.success'))
    //       .then(() => onRemoved())
    //       .catch(() => warning('page.account.reconcile.delete.failed'))
    //   }
    // })
  }

  return <tr>
    <td className='flex gap-0.5'>
      <ReconcilePreviousYearComponent year={ process.period - 1 }
                                      ref={ previousYearRef }
                                      endBalance={ process.balance.start }
                                      accountId={ accountId }
                                      onComplete={ onRemoved }/>
      <Button
        icon={ mdiHammer }
        outlined
        severity='info'
        className='p-0.5!'
        onClick={ () => previousYearRef?.current?.open() }
        data-testid={ `previous-year-button-${ process.period }` }/>
      <Button
        icon={ mdiRedo }
        outlined
        severity='success'
        className='p-0.5!'
        onClick={ onRetry }
        data-testid={ `retry-button-${ process.period }` }/>
      <Button
        icon={ mdiDelete }
        outlined
        severity='warning'
        className='p-0.5! mr-2'
        onClick={ onDelete }
        data-testid={ `remove-row-${ process.period }` }/>
    </td>
    <td>{ process.period }</td>
    <td><MoneyComponent money={ process.balance.start }/></td>
    <td><MoneyComponent money={ process.computed?.start }/></td>
    <td><MoneyComponent money={ process.balance.end }/></td>
    <td><MoneyComponent money={ NaN }/></td>
    <td></td>
  </tr>
}

export default ReconcileRowComponent
