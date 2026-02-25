import { mdiCancel, mdiContentSave } from "@mdi/js";
import React, { FC, useImperativeHandle } from "react";
import { useNotification } from "../../../context/notification-context";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account } from "../../../types/types";
import { Form, Input, SubmitButton } from "../../form";
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
  const { success, warning } = useNotification();

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (data: any) => {
    const processData = {
      balance: {
        start: data.openBalance,
        end: data.endBalance
      },
      period: data.year
    }

    AccountRepository.yearReconcile(account.id, processData)
      .then(() => success('page.accounts.reconcile.success'))
      .then(() => setVisible(false))
      .then(() => setTimeout(afterCreate, 500))
      .catch(() => warning('page.accounts.reconcile.error'))
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
