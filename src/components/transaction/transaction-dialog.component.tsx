import { mdiPageNext } from "@mdi/js";
import React, { FC } from "react";
import { useNavigate } from "react-router";
import { Resolver } from "../../core";
import { Account } from "../../types/types";
import { Entity, Form, SubmitButton } from "../form";
import { Button } from "../layout/button";
import { Dialog } from "../layout/popup";
import { PopupCallbacks } from "../layout/popup/popup.component";

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
    const onSelect = ({ account }: FormType) => navigate(`${Resolver.Account.resolveUrl(account)}/transactions/add/${type}`)
    const control: PopupCallbacks = { open: () => {}, close: () => {} }

    return <>
        <Button label={ `page.transactions.${type}.add` }
                        variant={ variant }
                        onClick={ () => control.open() }
                        icon={ icon }/>
        <Form onSubmit={ onSelect } entity='transaction'>
            <Dialog
                title='page.accounts.select'
                className='Large'
                control={ control }
                actions={[
                    <SubmitButton label='common.action.next'
                                  variant='success'
                                  type='submit'
                                  icon={ mdiPageNext }
                                  key='next-action'/>
                ]}>
                <Entity.ManagedAccount id='account'
                                       required
                                       title='page.accounts.reconcile.account'/>
            </Dialog>
        </Form>
    </>
}

export default NewTransactionDialog