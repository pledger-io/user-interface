import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {mdiCallSplit, mdiCancel, mdiContentSave} from "@mdi/js";

import {BreadCrumbItem, BreadCrumbs, Buttons, Layout, Notifications, Resolver} from "../../../core";
import {TransactionRepository} from "../../../core/RestAPI";
import AccountRepository from "../../../core/repositories/account-repository";

import {Form, SubmitButton} from "../../../core/form";
import GenericFieldsetComponent from "./GenericFieldsetComponent";
import MetadataFieldsetComponent from "./MetadataFieldsetComponent";

import '../../../assets/css/TransactionForm.scss'

const TransactionForm = () => {
    const {type, transactionType, id, transactionId} = useParams()
    const [account, setAccount] = useState({})
    const [transaction, setTransaction] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            AccountRepository.get(id)
                .then(setAccount)
        }
    }, [id])
    useEffect(() => {
        // load transaction defaults
        if (transactionId) {
            TransactionRepository.get(account.id, transactionId)
                .then(t => setTransaction({
                    ...t,
                    metadata: {
                        contract: t.metadata.contract ? {id: -1, name: t.metadata.contract} : undefined,
                        category: t.metadata.category ? {id: -1, name: t.metadata.category} : undefined,
                        budget: t.metadata.budget ? {id: -1, name: t.metadata.budget} : undefined,
                        tags: t.metadata.tags
                    }
                }))
        } else {
            const isDebit = transactionType === 'debit'
            const code = Resolver.Account.isManaged(account) ?
                    isDebit ? 'CREDIT' : 'DEBIT'
                    : transactionType.toUpperCase()
            setTransaction({
                source: !isDebit ? account : null,
                destination: isDebit ? account : null,
                type: {
                    code: code
                }
            })
        }
    }, [transactionType, transactionId, account])

    const onSubmit = e => processSubmit(transactionId, e, account.account.currency, navigate)
    const initialSplit = () => setTransaction(old => ({
        ...old,
        split: [{
            description: old.description,
            amount: old.amount
        }]
    }))

    const backendType = Resolver.Account.convertToBackendType(type)
    if (!transaction) return <Layout.Loading />
    return <>
        <div className='TransactionForm'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings' />
                <BreadCrumbItem label='page.nav.accounts' />
                <BreadCrumbItem label={`page.nav.accounts.${backendType}`}
                                href={`/accounts/${type}`}/>
                <BreadCrumbItem message={account?.name} />
                <BreadCrumbItem label='page.nav.transactions'
                                href={Resolver.Account.resolveUrl(account) + '/transactions'}/>
                <BreadCrumbItem label='common.action.edit' />
            </BreadCrumbs>

            <Form onSubmit={onSubmit} entity='Transaction'>
                <Layout.Card title='page.transactions.add'
                             buttons={[
                                 <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                                 <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>

                    <GenericFieldsetComponent transaction={transaction} account={account} />

                    <MetadataFieldsetComponent transaction={transaction} />

                    {transactionId && !transaction.split && <>
                        <fieldset className='Buttons'>
                            <Buttons.Button label='page.transaction.action.split'
                                            icon={mdiCallSplit}
                                            variant='primary'
                                            variantType='outline'
                                            onClick={initialSplit}/>
                        </fieldset>
                    </>}
                </Layout.Card>
            </Form>
        </div>
    </>
}

const processSubmit = (id, entity, currency, navigate) => {
    const transaction = {
        description: entity.description,
        source: {id: entity.from.id, name: entity.from.name},
        destination: {id: entity.to.id, name: entity.to.name},
        amount: entity.amount,
        currency: currency,
        date: entity.date,
        budget: entity.budget ? {id: -1, name: entity.budget.name} : null,
        category: entity.category ? {id: -1, name: entity.category.name} : null,
        contract: entity.contract ? {id: -1, name: entity.contract.name} : null,
        tags: entity.tags,
    }

    const promises = []
    if (isNaN(id)) {
        promises.push(TransactionRepository.create(transaction))
    } else {
        promises.push(TransactionRepository.update(id, transaction))
    }

    if (entity.split) {
        promises.push(TransactionRepository.splits(id, {
            splits: entity.split
        }))
    }

    Promise.all(promises)
        .then(() => Notifications.Service.success(replaceAction('page.transaction.{action}.success', id)))
        .then(() => navigate(-1))
        .catch(() => Notifications.Service.warning(replaceAction('page.transaction.{action}.failed', id)))
}

function replaceAction(text, id = null) {
    const action = isNaN(id) ? 'add' : 'update'
    return text.replaceAll('{action}', action)
}

export default TransactionForm