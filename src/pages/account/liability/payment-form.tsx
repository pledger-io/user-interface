import React from 'react'
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import { TransactionService } from "../../../service/TransactionService";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Entity, Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Translation from "../../../components/localization/translation.component";

const LiabilityPayment = () => {
    const account = useRouteLoaderData('liability')
    const transaction = useLoaderData()
    const navigate = useNavigate()

    const onSubmit = (entity) => {
        const { id } = transaction
        TransactionService.persist(account, entity, navigate, id)
    }

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='pae.nav.accounts'/>
            <BreadCrumbItem label='page.nav.accounts.liability'/>
            <BreadCrumbItem message={ account?.name }/>
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
                                           value={ transaction.source?.id }
                                           required
                                           title='Transaction.source'/>

                    <Input.Hidden id='to' value={ transaction.destination }/>
                    <Input.Text id='_none'
                                type='text'
                                value={ account?.name }
                                title='Transaction.to'
                                readonly
                                required/>

                    <Input.Amount id='amount'
                                  value={ transaction?.amount }
                                  title='Transaction.amount'
                                  currency={ transaction?.currency || account?.account?.currency }
                                  required/>

                    <Input.Date id='date'
                                value={ transaction?.dates?.transaction }
                                title='Transaction.date'
                                required/>
                </fieldset>

                <fieldset>
                    <legend><Translation label='page.transaction.add.link'/></legend>

                    <Entity.Category id='category'
                                     value={ transaction?.metadata?.category }
                                     title='Transaction.category'/>

                    <Input.Tags title='Transaction.tags'
                                value={ transaction?.metadata?.tags }
                                id='tags'/>
                </fieldset>
            </Card>
        </Form>
    </>
}

export default LiabilityPayment
