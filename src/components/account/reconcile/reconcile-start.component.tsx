import { mdiCancel, mdiContentSave } from "@mdi/js";
import React, { FC, useImperativeHandle } from "react";
import ProcessRepository, { BusinessKey } from "../../../core/repositories/process.repository";
import { Account } from "../../../types/types";
import NotificationService from "../../../service/notification.service";
import { Form, Input, SubmitButton } from "../../form";
import { ReconcileStart } from "./types";
import { Dialog } from "primereact/dialog";
import { i10n } from "../../../config/prime-locale";
import { Button } from "../../layout/button";

type ReconcileStartProps = {
  account: Account
  afterCreate: () => void
  ref: any
}

const ReconcileStartComponent: FC<ReconcileStartProps> = ({ ref, account, afterCreate }) => {
  const [visible, setVisible] = React.useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

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
      .then(() => setVisible(false))
      .then(() => setTimeout(afterCreate, 500))
      .catch(() => NotificationService.warning('page.accounts.reconcile.error'))
  }

  return <Dialog header={ i10n('page.accounts.reconcile.create') }
                 visible={ visible }
                 onHide={ () => setVisible(false) }>
    <Form entity='Account' onSubmit={ onSubmit }>
      <Input.Text title='page.accounts.reconcile.account'
                  id='name'
                  type='text'
                  readonly
                  value={ account.name }/>

      <Input.Text title='common.year'
                  id='year'
                  pattern="[1-9][0-9]{3}"
                  type='text'/>

      <Input.Amount title='page.accounts.reconcile.openBalance'
                    id='openBalance'/>

      <Input.Amount title='page.accounts.reconcile.endBalance'
                    id='endBalance'/>

      <div className='flex gap-1 justify-end mt-4'>
        <Button label='common.action.cancel'
                text
                severity='secondary'
                type='reset'
                onClick={ () => setVisible(false) }
                icon={ mdiCancel }/>
        <SubmitButton label='common.action.save'
                      icon={ mdiContentSave }
                      data-testid={ `reconcile-submit-button-${ account.id }` }/>
      </div>
    </Form>
  </Dialog>
}

export default ReconcileStartComponent
