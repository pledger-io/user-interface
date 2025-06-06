import { Card } from "primereact/card";
import React from 'react'
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import { ROUTER_ACCOUNT_LIABILITY_KEY, RouterAccount } from "../../../types/router-types";
import { Category, Transaction } from "../../../types/types";
import { TransactionService } from "../../../service/TransactionService";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Entity, Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";

const LiabilityPayment = () => {
  const account: RouterAccount = useRouteLoaderData(ROUTER_ACCOUNT_LIABILITY_KEY)
  const transaction: Transaction = useLoaderData()
  const navigate = useNavigate()
  const { success, warning } = useNotification()

  const onSubmit = (entity: any) => {
    const { id } = transaction
    TransactionService.persist(account, {
      ...entity,
      to: account
    }, navigate, id as number, success, warning)
  }

  if (!account) return <></>
  const model = transaction as Transaction
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.accounts'/>
      <BreadCrumbItem label='page.nav.accounts.liability'/>
      <BreadCrumbItem message={ account.name }/>
      <BreadCrumbItem label='page.nav.transactions'/>
      <BreadCrumbItem label='common.action.edit'/>
    </BreadCrumbs>

    <Card className='mx-2 my-4'
          header={ <div className='px-2 py-2 border-b-1 text-center font-bold'>{ i10n('page.transactions.add') }</div> }>
      <Form onSubmit={ onSubmit } entity='Transaction'>
        <fieldset>
          <legend className='font-bold text-xl underline'>{ i10n('page.transaction.add.details') }</legend>
          <Input.Text id='description'
                      type='text'
                      value={ transaction?.description }
                      title='Transaction.description'
                      required/>

          <div className='md:flex gap-2'>
            <Entity.ManagedAccount id='from'
                                   className='flex-1'
                                   value={ model.source?.id }
                                   required
                                   title='Transaction.source'/>

            <Input.Hidden id='to' value={ transaction.destination }/>
            <Input.Text id='_none'
                        type='text'
                        className='flex-1'
                        value={ account.name }
                        title='Transaction.to'
                        readonly
                        required/>
          </div>

          <div className='md:flex gap-2'>
            <Input.Amount id='amount'
                          className='flex-1'
                          value={ model?.amount }
                          title='Transaction.amount'
                          currency={ model?.currency || account?.account?.currency }
                          required/>

            <Input.Date id='date'
                        className='flex-1'
                        value={ model?.dates?.transaction }
                        title='Transaction.date'
                        required/>
          </div>
        </fieldset>

        <fieldset className='mt-4'>
          <legend className='font-bold text-xl underline'>{ i10n('page.transaction.add.link') }</legend>

          <Entity.Category id='category'
                           value={ { label: model.metadata?.category } as Category }
                           title='Transaction.category'/>

          <Entity.Budget id='budget'
                         value={ { label: model.metadata?.budget } }
                         title='Transaction.budget'/>

          <Input.Tags title='Transaction.tags'
                      value={ model?.metadata?.tags }
                      id='tags'/>
        </fieldset>

        <div className='flex justify-end gap-2 mt-4'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default LiabilityPayment
