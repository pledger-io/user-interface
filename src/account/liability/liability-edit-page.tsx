import React, { useEffect, useState } from "react";

import { Entity, Form, Input, SubmitButton } from '../../core/form'
import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Notifications, Translations } from "../../core";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import AccountRepository from "../../core/repositories/account-repository";
import { TransactionRepository } from "../../core/RestAPI";
import { useNavigate, useParams } from "react-router-dom";

import '../../assets/css/LiabilityForm.scss'
import { Account } from "../../core/types";

class AccountModel {

    name: string
    interest: number
    interestPeriodicity: string
    description: string
    currency: string
    iban: string
    bic: string
    number: string
    type: string | undefined

    constructor(account: Account) {
        this.name = account.name
        this.interest = account?.interest?.interest * 100
        this.interestPeriodicity = account.interest?.periodicity
        this.description = account.description
        this.currency = account.account.currency
        this.iban = account.account.iban
        this.bic = account.account.bic
        this.number = account.account.number
        this.type = account.type
    }
}

type OpeningBalance = {
    amount: number,
    startDate: string
}

const LiabilityForm = () => {
    const { id } = useParams()
    const [account, setAccount] = useState(new AccountModel({} as Account))
    const [openingBalance, setOpeningBalance] = useState<OpeningBalance>({ amount: 0 } as OpeningBalance)
    const navigate = useNavigate()

    const editLabel = !id ? 'page.title.accounts.liabilities.add' : 'page.title.accounts.liabilities.edit'

    useEffect(() => {
        if (id) {
            AccountRepository.get(id)
                .then(response => setAccount(new AccountModel(response)))
            AccountRepository.firstTransaction(id, 'Opening balance')
                .then(response => setOpeningBalance({
                    amount: response.amount,
                    startDate: response.dates.transaction
                }))
        }
    }, [id])

    const onSubmit = (entity : any) => {
        const updatedEntity = {
            ...entity,
            interest: entity.interest / 100,
            startDate: undefined,
            startBalance: undefined
        }

        if (!id) {
            AccountRepository.create(updatedEntity)
                .then(created => {
                    AccountRepository.search({ types: ['reconcile'] })
                        .then(response => {
                            TransactionRepository.create(`accounts/${created.id}/transactions`, {
                                date: entity.startDate,
                                amount: entity.startBalance,
                                currency: entity.currency,
                                source: { id: created.id },
                                destination: { id: response.content[0].id },
                                description: 'Opening balance'
                            })
                            .then(() => Notifications.Service.success('page.accounts.liability.created.success'))
                            .then(() => navigate(-1))
                        })
                })
        } else {
            AccountRepository.update(id, updatedEntity)
                .then(() => Notifications.Service.success('page.accounts.liability.update.success'))
                .then(() => navigate(-1))
        }
    }

    return (
        <div className="LiabilityForm">
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability' href='./../'/>
                <BreadCrumbItem label={editLabel}/>
            </BreadCrumbs>

            <Form entity='Account' onSubmit={onSubmit}>
                <Layout.Card title={editLabel}
                      buttons={[
                          <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                          <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>

                    <div>
                        <fieldset>
                            <legend><Translations.Translation label='page.account.accounts.general'/></legend>

                            <Input.Text id='name'
                                        value={ account.name }
                                        title='Account.name'
                                        help='Account.name.help'
                                        type='text'
                                        required/>

                            <Input.Select id='type'
                                          value={ account.type }
                                          title='Account.type'>
                                <Input.SelectOption value='loan' label='AccountType.loan'/>
                                <Input.SelectOption value='mortgage' label='AccountType.mortgage'/>
                                <Input.SelectOption value='debt' label='AccountType.debt'/>
                            </Input.Select>

                            <Entity.Currency id='currency'
                                             value={ account.currency }
                                             title='Account.currency'
                                             required />

                            <Input.Text title='Account.interest'
                                        type='number'
                                        id='interest'
                                        value={ account.interest }
                                        required/>

                            <Input.Select id='interestPeriodicity'
                                          title='Account.interestPeriodicity'
                                          value={ account.interestPeriodicity }
                                          required>
                                <Input.SelectOption value='MONTHS' label='Periodicity.MONTHS'/>
                                <Input.SelectOption value='YEARS' label='Periodicity.YEARS'/>
                            </Input.Select>
                        </fieldset>
                        <fieldset>
                            <legend><Translations.Translation label='page.account.accounts.liability.opening'/></legend>

                            <Input.Date id='startDate'
                                        readonly={ id !== undefined }
                                        required={!id}
                                        value={ openingBalance.startDate }
                                        title='page.accounts.liability.startDate' />

                            <Input.Text type='number'
                                        id='startBalance'
                                        readonly={ id !== undefined }
                                        required={!id}
                                        min={0}
                                        value={ openingBalance.amount }
                                        title='page.accounts.liability.startBalance'
                                        help='page.accounts.liability.startBalance.help'/>
                        </fieldset>
                    </div>
                    <fieldset>
                        <legend><Translations.Translation label='page.account.accounts.accountdetails'/></legend>

                        <Input.Text id='number'
                                    type='text'
                                    title='page.accounts.liability.number'
                                    help='page.accounts.liability.number.help'
                                    value={ account.number } />

                        <Input.Text id='description'
                                    type='text'
                                    title='Account.description'
                                    value={ account.description } />
                    </fieldset>
                </Layout.Card>
            </Form>
        </div>
    )
}

export default LiabilityForm
