import React from 'react'
import {PathParams, withNavigation, withPathParams} from "../../core/hooks";
import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Translations} from "../../core";
import {Entity, Form, Input, SubmitButton} from "../../core/form";
import {TransactionService} from "./TransactionService";
import {mdiCancel, mdiContentSave} from "@mdi/js";

class LiabilityPayment extends React.Component {
    static contextType = PathParams

    state = {
        account: {
            id: -1,
            type: 'none'
        }
    }

    constructor(props, context) {
        super(props, context);

        this.context.resolved = ({id, transactionId}) => {
            TransactionService.fetchAccount({id})
                .then(account => this.setState({
                    account: account,
                    transaction: {
                        destination: account,
                        type: {
                            code: 'DEBIT'
                        },
                    }
                }))

            TransactionService.fetchTransaction({id, transactionId})
                .then(transaction => this.setState({
                    transaction: transaction
                }))
        }
    }

    process(entity) {
        const {account, transaction: {id}} = this.state
        const {navigate} = this.props

        TransactionService.persist(account, entity, navigate, id)
    }

    render() {
        const {account, transaction = null} = this.state
        if (transaction === null) {
            return ''
        }

        return (
            <div className='LiabilityPaymentForm'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label='page.nav.accounts.liability'/>
                    <BreadCrumbItem message={account?.name}/>
                    <BreadCrumbItem label='page.nav.transactions'/>
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
                                        value={transaction?.description}
                                        title='Transaction.description'
                                        required/>

                            <Entity.ManagedAccount id='from'
                                                   value={transaction.source?.id}
                                                   required
                                                   title='Transaction.source'/>

                            <Input.Hidden id='to' value={transaction.destination} />
                            <Input.Text id='_none'
                                        value={account?.name}
                                        title='Transaction.to'
                                        readonly
                                        required/>

                            <Input.Amount id='amount'
                                          value={transaction?.amount}
                                          title='Transaction.amount'
                                          currency={transaction?.currency || account?.account?.currency}
                                          required/>

                            <Input.Date id='date'
                                        value={transaction?.dates?.transaction}
                                        title='Transaction.date'
                                        required />
                        </fieldset>

                        <fieldset>
                            <legend><Translations.Translation label='page.transaction.add.link'/></legend>

                            <Entity.Category id='category'
                                             value={transaction?.metadata?.category}
                                             title='Transaction.category'/>

                            <Input.Tags title='Transaction.tags'
                                        value={transaction?.metadata?.tags}
                                        id='tags' />
                        </fieldset>
                    </Card>
                </Form>
            </div>
        )
    }
}

const formWithPathParams = withPathParams(withNavigation(LiabilityPayment))

export {
    formWithPathParams as LiabilityPaymentForm
}

