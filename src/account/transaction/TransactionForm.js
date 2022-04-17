import React from "react";
import {PathParams, withNavigation, withPathParams} from "../../core/hooks";

import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Notifications, Resolver, Translations} from "../../core";
import restAPI from "../../core/RestAPI";
import {Entity, Form, Input, SubmitButton} from "../../core/form";
import {mdiCancel, mdiContentSave} from "@mdi/js";

import '../../assets/css/TransactionForm.scss'

class TransactionForm extends React.Component {
    static contextType = PathParams

    state = {
        account: {id: -1, type: 'none'},
        type: {
            frontend: null,
            backend: null
        },
        transaction: {}
    }

    constructor(props, context) {
        super(props, context);

        this.context.resolved = ({id, type, transactionType, transactionId}) => {
            restAPI.get(`accounts/${id}`)
                .then(account => {
                    const updateState = {
                        ...this.state,
                        account: account,
                        type: {
                            backend: Resolver.Account.convertToBackendType(type),
                            frontend: type
                        }
                    }
                    if (isNaN(transactionId)) {
                        updateState.transaction = {
                            source: transactionType !== 'debit' ? account : null,
                            destination: transactionType === 'debit' ? account : null,
                            type: {
                                code: transactionType.toUpperCase()
                            }

                        }
                    }
                    this.setState(updateState)
                })

            if (!isNaN(transactionId)) {
                restAPI.get(`accounts/${id}/transactions/${transactionId}`)
                    .then(transaction => this.setState({
                        transaction: {
                            ...transaction,
                            metadata: {
                                contract: transaction.metadata.contract ? {id: -1, name: transaction.metadata.contract} : undefined,
                                category: transaction.metadata.category ? {id: -1, name: transaction.metadata.category} : undefined,
                                budget: transaction.metadata.budget ? {id: -1, name: transaction.metadata.budget} : undefined,
                                tags: transaction.metadata.tags
                            }
                        }
                    }))
            }
        }
    }

    process(entity) {
        const {transaction, account} = this.state
        const {navigate} = this.props

        const updatedTransaction = {
            description: entity.description,
            source: {id: entity.from.id, name: entity.from.name},
            destination: {id: entity.to.id, name: entity.to.name},
            amount: entity.amount,
            currency: transaction.currency ? transaction.currency : account.account.currency,
            date: entity.date,
            budget: entity.budget ? {id: -1, name: entity.budget.name} : null,
            category: entity.category ? {id: -1, name: entity.category.name} : null,
            contract: entity.contract ? {id: -1, name: entity.contract.name} : null,
            tags: entity.tags,
        }

        if (isNaN(transaction.id)) {
            restAPI.put(`accounts/${account.id}/transactions`, updatedTransaction)
                .then(() => Notifications.Service.success('page.transaction.add.success'))
                .then(() => navigate(-1))
                .catch(() => Notifications.Service.success('page.transaction.add.failed'))
        } else {
            restAPI.post(`accounts/${account.id}/transactions/${transaction.id}`, updatedTransaction)
                .then(() => Notifications.Service.success('page.transaction.update.success'))
                .then(() => navigate(-1))
                .catch(() => Notifications.Service.success('page.transaction.update.failed'))
        }
    }

    render() {
        const {type, account = null, transaction} = this.state

        return (
            <div className='TransactionForm'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings' />
                    <BreadCrumbItem label='page.nav.accounts' />
                    <BreadCrumbItem label={`page.nav.accounts.${type.backend}`}
                                    href={`/accounts/${type.frontend}`}/>
                    <BreadCrumbItem message={account?.name} />
                    <BreadCrumbItem label='page.nav.transactions'
                                    href={Resolver.Account.resolveUrl(account) + '/transactions'}/>
                    <BreadCrumbItem label='common.action.edit' />
                </BreadCrumbs>

                <Form onSubmit={this.process.bind(this)} entity='Transaction'>
                    <Card title='page.transactions.add'
                          buttons={[
                              <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                              <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                        <fieldset>
                            <legend><Translations.Translation label='page.transaction.add.details'/></legend>

                            <Input.Text id='description'
                                        value={transaction.description}
                                        title='Transaction.description'
                                        required/>

                            {this.renderSourceAccount()}

                            {this.renderDestinationAccount()}

                            <Input.Amount id='amount'
                                          value={transaction.amount}
                                          title='Transaction.amount'
                                          currency={transaction.currency || account.account?.currency}
                                          required/>

                            <Input.Date id='date'
                                        value={transaction.dates?.transaction}
                                        title='Transaction.date'
                                        required />
                        </fieldset>

                        <fieldset>
                            <legend><Translations.Translation label='page.transaction.add.link'/></legend>

                            <Entity.Category id='category'
                                             value={transaction.metadata?.category}
                                             title='Transaction.category'/>

                            {!Resolver.Transaction.isTransfer(transaction) &&
                            <Entity.Budget id='budget'
                                           value={transaction.metadata?.budget}
                                           title='Transaction.budget'/>}

                            {!Resolver.Transaction.isTransfer(transaction) &&
                            <Entity.Contract id='contract'
                                             value={transaction.metadata?.contract}
                                             title='Transaction.contract' />}

                            <Input.Tags title='Transaction.tags'
                                        value={transaction.metadata?.tags}
                                        id='tags' />
                        </fieldset>

                        {!isNaN(transaction.id) &&
                        <fieldset className='Buttons'>
                            <div>
                                <Buttons.Button label='page.transaction.action.split' variant='primary' variantType='outline' />
                            </div>
                        </fieldset>
                        }
                    </Card>
                </Form>
            </div>
        )
    }

    renderSourceAccount() {
        const {transaction: {source, type}} = this.state

        if (type?.code?.toLowerCase() === 'debit') {
            return <Entity.Account id='from'
                                   type='debtor'
                                   value={source}
                                   required
                                   title='Transaction.source'/>
        }

        return <Entity.ManagedAccount id='from'
                                      value={source}
                                      required
                                      title='Transaction.source'/>
    }

    renderDestinationAccount() {
        const {transaction: {destination, type}} = this.state

        if (type?.code?.toLowerCase() === 'credit') {
            return <Entity.Account id='to'
                                   type='creditor'
                                   value={destination}
                                   required
                                   title='Transaction.to'/>
        }

        return <Entity.ManagedAccount id='to'
                                      value={destination}
                                      required
                                      title='Transaction.to'/>
    }
}

const formWithPathParams = withPathParams(withNavigation(TransactionForm))

export {
    formWithPathParams as TransactionForm
}
