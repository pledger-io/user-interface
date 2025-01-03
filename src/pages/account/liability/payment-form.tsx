import React from 'react'
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import Loading from "../../../components/layout/loading.component";
import { Category, Transaction } from "../../../types/types";
import { TransactionService } from "../../../service/TransactionService";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Entity, Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Translation from "../../../components/localization/translation.component";

const LiabilityPayment = () => {
    const account: any = useRouteLoaderData('liability')
    const transaction: any = useLoaderData()
    const navigate = useNavigate()

    const onSubmit = (entity: any) => {
        const { id } = transaction
        TransactionService.persist(account, {
            ...entity,
            to: account
        }, navigate, id)
    }

    if (!account) return <Loading/>
    const model = transaction as Transaction
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label='page.nav.accounts.liability'/>
            <BreadCrumbItem message={ account.name }/>
            <BreadCrumbItem label='page.nav.transactions'/>
            <BreadCrumbItem label='common.action.edit' />
        </BreadCrumbs>

        <Form onSubmit={ onSubmit } entity='Transaction'>
            <Card title='page.transactions.add'
                  buttons={ [
                      <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                      <BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>] }>
                <fieldset>
                    <legend><Translation label='page.transaction.add.details'/></legend>
                    <Input.Text id='description'
                                type='text'
                                value={ transaction?.description }
                                title='Transaction.description'
                                required/>

                    <Entity.ManagedAccount id='from'
                                           value={ model.source?.id }
                                           required
                                           title='Transaction.source'/>

                    <Input.Hidden id='to' value={ transaction.destination }/>
                    <Input.Text id='_none'
                                type='text'
                                value={ account.name }
                                title='Transaction.to'
                                readonly
                                required/>

                    <Input.Amount id='amount'
                                  value={ model?.amount }
                                  title='Transaction.amount'
                                  currency={ model?.currency || account?.account?.currency }
                                  required/>

                    <Input.Date id='date'
                                value={ model?.dates?.transaction }
                                title='Transaction.date'
                                required/>
                </fieldset>

                <fieldset>
                    <legend><Translation label='page.transaction.add.link'/></legend>

                    <Entity.Category id='category'
                                     value={ {label: model.metadata?.category} as Category }
                                     title='Transaction.category'/>

                    <Input.Tags title='Transaction.tags'
                                value={ model?.metadata?.tags }
                                id='tags'/>
                </fieldset>
            </Card>
        </Form>
    </>
}

export default LiabilityPayment
