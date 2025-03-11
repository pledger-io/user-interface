import { mdiPageNext } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { FC } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { Resolver } from "../../core";
import { Account } from "../../types/types";
import { Entity, Form, SubmitButton } from "../form";
import { Button } from "../layout/button";

type NewTransactionDialogProps = {
  variant: 'success' | 'warning' | 'info',
  icon: string,
  type: 'debit' | 'credit' | 'transfer'
}

type FormType = {
  account: Account
}

const NewTransactionDialog: FC<NewTransactionDialogProps> = ({ variant, icon, type }) => {
  const navigate = useNavigate()
  const onSelect = ({ account }: FormType) => navigate(`${ Resolver.Account.resolveUrl(account) }/transactions/add/${ type }`)
  const [visible, setVisible] = React.useState(false)

  return <>
    <Button label={ `page.transactions.${ type }.add` }
            severity={ variant }
            className='[&>.Translation]:hidden text-xl md:text-sm md:[&>.Translation]:block'
            onClick={ () => setVisible(true) }
            icon={ icon }/>
    <Dialog
      header={ i10n('page.accounts.select') }
      visible={ visible }
      onHide={ () => setVisible(false) }>
      <Form onSubmit={ onSelect } entity='transaction'>
        <Entity.ManagedAccount id='account'
                               required
                               title='page.accounts.reconcile.account'/>

        <div className='flex justify-end mt-4'>
          <SubmitButton label='common.action.next'
                        severity='success'
                        icon={ mdiPageNext }/>
        </div>
      </Form>
    </Dialog>
  </>
}

export default NewTransactionDialog
