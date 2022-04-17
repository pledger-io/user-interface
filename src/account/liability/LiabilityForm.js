import React from "react";
import {PathParams, withNavigation} from "../../core/hooks";

import {Form, Input, SubmitButton, Entity} from '../../core/form'
import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Notifications, Translations} from "../../core";
import {mdiCancel, mdiContentSave} from "@mdi/js";
import restAPI from "../../core/RestAPI";

import '../../assets/css/LiabilityForm.scss'

class AccountModel {

    constructor(account) {
        this.name = account.name
        this.interest = account.interest?.interest * 100
        this.interestPeriodicity = account.interest?.periodicity
        this.description = account.description
        this.currency = account.account.currency
        this.iban = account.account.iban
        this.bic = account.account.bic
        this.number = account.account.number
        this.type = account.type
    }
}

class AccountService {
    load(id) {
        return new Promise((resolved, failed) => {
            console.log(`[AccountService] : Loading liability account ${id}`)
            restAPI.get(`accounts/${id}`)
                .then(account => resolved(new AccountModel(account)))
                .catch(e => failed(e))
        })
    }

    /**
     * Load the first transaction related to the provided liability account. This should always be the opening balance.
     *
     * @param id the identifier of the liability account
     * @returns {Promise<Object>} the resulting transaction
     */
    loadOpeningBalance(id) {
        console.log(`[AccountService] : Loading in the opening balance for account id ${id}`)
        return restAPI.get(`accounts/${id}/transactions/first?description=Opening balance`)
    }

    /**
     * Creates the liability account. If this creation succeeds it will also create the initial transaction to set
     * the opening balance correctly.
     *
     * @param account the information to create the liability account with
     * @param openingBalance the opening balance expected for the loan
     * @returns {Promise<void>} a promise that will either yield an exception or nothing
     */
    create(account, openingBalance) {
        return new Promise(async(resolver, failure) => {
            const reconcileAccountPage = await restAPI.post('accounts', {accountTypes: ['reconcile'], page: 0})
            console.log(`[AccountService] : Creating liability account with reconcile ${reconcileAccountPage.content[0].id}`)

            restAPI.put('accounts', account)
                .then(persisted => {
                    console.log(`[AccountService] : Created liability account ${persisted.id}`)
                    restAPI.put(`accounts/${persisted.id}/transactions`, {
                        ...openingBalance,
                        currency: account.currency,
                        source: {id: persisted.id},
                        destination: {id: reconcileAccountPage.content[0].id},
                        description: 'Opening balance'
                    })
                        .then(() => resolver())
                        .catch(exception => failure(exception))
                })
                .catch(exception => failure(exception))
        })
    }

    update(id, account) {
        return restAPI.post(`accounts/${id}`, account)
    }
}
const service = new AccountService()

class LiabilityForm extends React.Component {
    static contextType = PathParams

    state = {
        id: NaN,
        openingBalance: {},
        account: {},
        exception: null
    }

    constructor(props, context) {
        super(props, context);

        // The resolved will be called if the path params change, in this case the id of the account
        this.context.resolved = params => {
            const {id} = params
            if (!isNaN(id)) {
                service.load(id)
                    .then(account => this.setState({
                        ...this.state,
                        id: id,
                        account: account
                    }))
                    .catch(exception => this.setState({
                        id: id,
                        exception: exception
                    }))
                service.loadOpeningBalance(id)
                    .then(initialPayment => this.setState({
                        ...this.state,
                        openingBalance: {
                            amount: initialPayment.amount,
                            startDate: initialPayment.dates.transaction
                        }
                    }))
                    .catch(exception => this.setState({
                        ...this.state,
                        exception: exception
                    }))
            }
        }
    }

    submit(entity) {
        const {id} = this.state
        const {navigate} = this.props
        const account = {
            ...entity,
            interest: entity.interest / 100
        }

        delete account['startDate']
        delete account['startBalance']

        if (isNaN(id)) {
            service.create(account, {date: entity.startDate, amount: entity.startBalance})
                .then(() => Notifications.Service.success('page.accounts.liability.created.success'))
                .then(() => navigate(-1))
                .catch(exception => this.setState({
                    ...this.state,
                    exception: exception
                }))
        } else {
            service.update(id, account)
                .then(() => Notifications.Service.success('page.accounts.liability.update.success'))
                .then(() => navigate(-1))
                .catch(exception => this.setState({
                    ...this.state,
                    exception: exception
                }))
        }
    }

    render() {
        const {id, account, openingBalance} = this.state
        const editLabel = isNaN(id) ? 'page.title.accounts.liabilities.add' : 'page.title.accounts.liabilities.edit'

        return (
            <div className="LiabilityForm">
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label='page.nav.accounts.liability' href='./../'/>
                    <BreadCrumbItem label={editLabel}/>
                </BreadCrumbs>

                <Form entity='Account' onSubmit={this.submit.bind(this)}>
                    <Card title={editLabel}
                          buttons={[
                              <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                              <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>

                        <div>
                            <fieldset>
                                <legend><Translations.Translation label='page.account.accounts.general'/></legend>

                                <Input.Text id='name'
                                             value={account.name}
                                             title='Account.name'
                                             help='Account.name.help'
                                             type='text'
                                             required/>

                                <Input.Select id='type'
                                              value={account.type}
                                              title='Account.type'>
                                    <Input.SelectOption value='loan' label='AccountType.loan'/>
                                    <Input.SelectOption value='mortgage' label='AccountType.mortgage'/>
                                    <Input.SelectOption value='debt' label='AccountType.debt'/>
                                </Input.Select>

                                <Entity.Currency id='currency'
                                                value={account.currency}
                                                title='Account.currency'
                                                required />

                                <Input.Text title='Account.interest'
                                             type='number'
                                             id='interest'
                                             value={account.interest}
                                             required/>

                                <Input.Select id='interestPeriodicity'
                                              title='Account.interestPeriodicity'
                                              value={account.interestPeriodicity}
                                              required>
                                    <Input.SelectOption value='MONTHS' label='Periodicity.MONTHS'/>
                                    <Input.SelectOption value='YEARS' label='Periodicity.YEARS'/>
                                </Input.Select>
                            </fieldset>
                            <fieldset>
                                <legend><Translations.Translation label='page.account.accounts.liability.opening'/></legend>

                                <Input.Date id='startDate'
                                            readonly={!isNaN(id)}
                                            required={isNaN(id)}
                                            value={openingBalance.startDate}
                                            title='page.accounts.liability.startDate' />

                                <Input.Text type='number'
                                             id='startBalance'
                                             readonly={!isNaN(id)}
                                             required={isNaN(id)}
                                             min={0}
                                             value={openingBalance.amount}
                                             title='page.accounts.liability.startBalance'
                                             help='page.accounts.liability.startBalance.help'/>
                            </fieldset>
                        </div>
                        <fieldset>
                            <legend><Translations.Translation label='page.account.accounts.accountdetails'/></legend>

                            <Input.Text id='number'
                                         title='page.accounts.liability.number'
                                         help='page.accounts.liability.number.help'
                                         value={account.number} />

                            <Input.Text id='description'
                                        title='Account.description'
                                        value={account.description} />
                        </fieldset>
                    </Card>
                </Form>
            </div>
        )
    }
}

const formWithNavigate = withNavigation(LiabilityForm)

export {
    formWithNavigate as LiabilityForm
}
