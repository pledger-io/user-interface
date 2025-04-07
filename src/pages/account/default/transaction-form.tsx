import { mdiCallSplit, mdiCancel, mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import React, { useCallback, useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams, useRouteLoaderData } from "react-router";
import GenericFieldsetComponent from "../../../components/account/transaction/generic-fieldset.component";
import MetadataFieldsetComponent, {
  Suggestion,
  SuggestionFunction
} from "../../../components/account/transaction/metadata-fieldset.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Form, SubmitButton } from "../../../components/form";
import { BackButton, Button } from "../../../components/layout/button";
import Loading from "../../../components/layout/loading.component";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import { Resolver } from "../../../core";
import { TransactionRepository } from "../../../core/RestAPI";
import { ROUTER_ACCOUNT_KEY, RouterAccount } from "../../../types/router-types";
import { Account, Transaction } from "../../../types/types";

const TransactionForm = () => {
  const { type, transactionType, transactionId } = useParams()
  const [transaction, setTransaction] = useState<Transaction>()
  const navigate = useNavigate()
  const { warning, success } = useNotification()
  const account: RouterAccount = useRouteLoaderData(ROUTER_ACCOUNT_KEY)

  if (!account) return <Loading/>

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
    (e: any) => processSubmit(transactionId as string, e, account.account.currency, navigate, warning, success),
    [account?.account.currency, transactionId, navigate])

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
    if (['from', 'to', 'amount', 'description'].indexOf(e.changed) == -1) {
      return
    }
    const suggestionReq = {
      source: e.value.from?.name,
      destination: e.value.to?.name,
      amount: e.value.amount ? parseFloat(e.amount) : null,
      description: e.value.description
    }

    TransactionRepository.suggest(suggestionReq)
      .then((result: Suggestion) => suggestionFunction.suggest(result))
      .catch(console.error)
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.transactions.add') }
  </div>
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

    <Card className='my-4 mx-2' header={ header }>
      <Form onSubmit={ onSubmit } entity='Transaction' onChange={ onInputChanged }>

        <GenericFieldsetComponent transaction={ transaction } account={ account as Account }/>
        <MetadataFieldsetComponent transaction={ transaction } suggestionFunc={ suggestionFunction }/>

        { transactionId && !transaction.split && <>
          <fieldset className='mt-4 flex justify-center'>
            <Button label='page.transaction.action.split'
                    className='w-xl px-auto'
                    outlined={ true }
                    icon={ mdiCallSplit }
                    onClick={ initialSplit }/>
          </fieldset>
        </> }

        <div className='flex justify-end gap-2 mt-2'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </div>
}

const processSubmit = (id: string, entity: any, currency: string, navigate: NavigateFunction, warning: any, success: any) => {
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
    .then(() => success(replaceAction('page.transaction.{action}.success', parseInt(id))))
    .then(() => navigate(-1))
    .catch(() => warning(replaceAction('page.transaction.{action}.failed', parseInt(id))))
}

function replaceAction(text: string, id = NaN) {
  const action = isNaN(id) ? 'add' : 'update'
  return text.replaceAll('{action}', action)
}

export default TransactionForm
