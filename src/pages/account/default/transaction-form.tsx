import '../../../assets/css/TransactionForm.scss'
import { mdiCallSplit, mdiCancel, mdiContentSave } from "@mdi/js";
import { useCallback, useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams, useRouteLoaderData } from "react-router";
import GenericFieldsetComponent from "../../../components/account/transaction/generic-fieldset.component";
import MetadataFieldsetComponent, {
    SuggestionFunction, Suggestion
} from "../../../components/account/transaction/metadata-fieldset.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Form, SubmitButton } from "../../../components/form";
import { BackButton, Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";
import { Resolver } from "../../../core";
import { TransactionRepository } from "../../../core/RestAPI";
import { Account, Transaction } from "../../../types/types";
import NotificationService from "../../../service/notification.service";

const TransactionForm = () => {
    const { type, transactionType, transactionId } = useParams()
    const [transaction, setTransaction] = useState<Transaction>()
    const navigate = useNavigate()
    const account: any = useRouteLoaderData('other-detail')

    useEffect(() => {
        // load transaction defaults
        if (transactionId) {
            TransactionRepository.get(account?.id, transactionId)
                .then(t => setTransaction({
                    ...t,
                    metadata: {
                        contract: t.metadata.contract ? { id: -1, name: t.metadata.contract } : undefined,
                        category: t.metadata.category ? { id: -1, name: t.metadata.category } : undefined,
                        budget: t.metadata.budget ? { id: -1, name: t.metadata.budget } : undefined,
                        tags: t.metadata.tags
                    }
                }))
        } else {
            const isDebit = transactionType === 'debit'
            const code = Resolver.Account.isManaged(account) ?
                isDebit ? 'CREDIT' : 'DEBIT'
                : transactionType?.toUpperCase()
            setTransaction({
                source: !isDebit ? account : null,
                destination: isDebit ? account : null,
                type: {
                    code: code
                }
            } as Transaction)
        }
    }, [transactionType, transactionId, account])

    const onSubmit = useCallback(
        (e: any) => processSubmit(transactionId as string, e, account.account.currency, navigate),
        [account.account.currency, transactionId, navigate])

    const initialSplit = () => setTransaction(old => {
        const existing = old as Transaction
        return {
            ...existing,
            split: [{
                description: old?.description,
                amount: old?.amount
            }]
        } as any
    })

    const suggestionFunction: SuggestionFunction = { suggest: (_: Suggestion) => void 0 }
    const onInputChanged = (e: any) => {
        const suggestionReq = {
            source: e.from?.name,
            destination: e.to?.name,
            amount: e.amount ? parseFloat(e.amount) : null,
            description: e.description
        }

        TransactionRepository.suggest(suggestionReq)
            .then((result: Suggestion) => suggestionFunction.suggest(result))
    }

    const backendType = Resolver.Account.convertToBackendType(type)
    if (!transaction || !account) return <Loading/>
    return <div className='TransactionForm'>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label={ `page.nav.accounts.${ backendType }` }
                            href={ `/accounts/${ type }` }/>
            <BreadCrumbItem message={ account?.name }/>
            <BreadCrumbItem label='page.nav.transactions'
                            href={ Resolver.Account.resolveUrl(account) + '/transactions' }/>
            <BreadCrumbItem label='common.action.edit'/>
        </BreadCrumbs>

        <Form onSubmit={ onSubmit } entity='Transaction' onChange={ onInputChanged }>
            <Card title='page.transactions.add'
                  buttons={ [
                      <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                      <BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>] }>

                <GenericFieldsetComponent transaction={ transaction } account={ account as Account }/>

                <MetadataFieldsetComponent transaction={ transaction } suggestionFunc={ suggestionFunction }/>

                { transactionId && !transaction.split && <>
                    <fieldset className='Buttons'>
                        <Button label='page.transaction.action.split'
                                icon={ mdiCallSplit }
                                variant='primary'
                                variantType='outline'
                                onClick={ initialSplit }/>
                    </fieldset>
                </> }
            </Card>
        </Form>
    </div>
}

const processSubmit = (id: string, entity: any, currency: string, navigate: NavigateFunction) => {
    const transaction = {
        description: entity.description,
        source: { id: entity.from.id, name: entity.from.name },
        destination: { id: entity.to.id, name: entity.to.name },
        amount: entity.amount,
        currency: currency,
        date: entity.date,
        budget: entity.budget ? { id: -1, name: entity.budget.name } : null,
        category: entity.category ? { id: -1, name: entity.category.name } : null,
        contract: entity.contract ? { id: -1, name: entity.contract.name } : null,
        tags: entity.tags,
    }

    const promises = []
    if (isNaN(parseInt(id))) {
        promises.push(TransactionRepository.create(transaction.source.id, transaction))
    } else {
        promises.push(TransactionRepository.update(id, transaction))
    }

    if (entity.split) {
        promises.push(TransactionRepository.splits(id, {
            splits: entity.split
        }))
    }

    Promise.all(promises)
        .then(() => NotificationService.success(replaceAction('page.transaction.{action}.success', parseInt(id))))
        .then(() => navigate(-1))
        .catch(() => NotificationService.warning(replaceAction('page.transaction.{action}.failed', parseInt(id))))
}

function replaceAction(text: string, id = NaN) {
    const action = isNaN(id) ? 'add' : 'update'
    return text.replaceAll('{action}', action)
}

export default TransactionForm