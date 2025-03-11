import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Entity, Form, Input, SubmitButton } from '../../../components/form'
import { BackButton } from "../../../components/layout/button";
import Translation from "../../../components/localization/translation.component";
import { i10n } from "../../../config/prime-locale";
import AccountRepository from "../../../core/repositories/account-repository";
import { TransactionRepository } from "../../../core/RestAPI";
import { Account } from "../../../types/types";
import NotificationService from "../../../service/notification.service";

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
    this.interest = (account?.interest?.interest || 0) * 100
    this.interestPeriodicity = account.interest?.periodicity
    this.description = account.description
    this.currency = account?.account?.currency
    this.iban = account?.account?.iban
    this.bic = account?.account?.bic
    this.number = account?.account?.number
    this.type = account.type
  }
}

type OpeningBalance = {
  amount: number,
  startDate: string
}

const LiabilityForm = () => {
  const { id } = useParams()
  const [account, setAccount] = useState(() => new AccountModel({} as Account))
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

  const onSubmit = (entity: any) => {
    const updatedEntity = {
      ...entity,
      interest: entity.interest / 100,
      startDate: undefined,
      startBalance: undefined
    }

    if (!id) {
      AccountRepository.create(updatedEntity)
        .then(created => {
          AccountRepository.search({ types: ['reconcile'] as any })
            .then(response => {
              TransactionRepository.create(created.id, {
                date: entity.startDate,
                amount: entity.startBalance,
                currency: entity.currency,
                source: { id: created.id },
                destination: { id: response.content[0].id },
                description: 'Opening balance'
              })
                .then(() => NotificationService.success('page.accounts.liability.created.success'))
                .then(() => navigate(-1))
                .catch(() => NotificationService.warning('page.accounts.liability.created.failed'))
            })
        }).catch(() => NotificationService.warning('page.accounts.liability.created.failed'))
    } else {
      AccountRepository.update(id, updatedEntity)
        .then(() => NotificationService.success('page.accounts.liability.update.success'))
        .then(() => navigate(-1))
    }
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n(editLabel) }
  </div>
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.accounts'/>
      <BreadCrumbItem label='page.nav.accounts.liability' href='./../'/>
      <BreadCrumbItem label={ editLabel }/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <Form entity='Account' onSubmit={ onSubmit }>
        <div className='flex gap-4'>
          <fieldset className='flex-1'>
            <legend className='font-bold text-xl underline'>{ i10n('page.account.accounts.general') }</legend>

            <Input.Text id='name'
                        value={ account.name }
                        title='Account.name'
                        help='Account.name.help'
                        type='text'
                        required/>

            <Input.Select id='type'
                          value={ account.type }
                          options={ [
                            { label: 'AccountType.loan', value: 'loan' },
                            { label: 'AccountType.mortgage', value: 'mortgage' },
                            { label: 'AccountType.debt', value: 'debt' }
                          ] }
                          title='Account.type'/>

            <Entity.Currency id='currency'
                             value={ account.currency }
                             title='Account.currency'
                             required/>

            <div className='md:flex gap-4'>
              <Input.Text title='Account.interest'
                          type='number'
                          id='interest'
                          className='md:flex-1'
                          value={ account.interest }
                          required/>

              <Input.Select id='interestPeriodicity'
                            title='Account.interestPeriodicity'
                            className='flex-1'
                            value={ account.interestPeriodicity }
                            options={ [
                              { label: 'Periodicity.MONTHS', value: 'MONTHS' },
                              { label: 'Periodicity.YEARS', value: 'YEARS' }
                            ] }
                            required/>
            </div>
          </fieldset>
          <fieldset className='flex-1'>
            <legend className='font-bold text-xl underline'><Translation
              label='page.account.accounts.liability.opening'/></legend>

            <Input.Date id='startDate'
                        readonly={ id !== undefined }
                        required={ !id }
                        value={ openingBalance.startDate }
                        title='page.accounts.liability.startDate'/>

            <Input.Amount id='startBalance'
                          readonly={ id !== undefined }
                          required={ !id }
                          min={ 0 }
                          value={ openingBalance.amount }
                          title='page.accounts.liability.startBalance'
                          help='page.accounts.liability.startBalance.help'/>
          </fieldset>
        </div>
        <fieldset className='my-4'>
          <legend className='font-bold text-xl underline'><Translation
            label='page.account.accounts.accountdetails'/></legend>

          <Input.Text id='number'
                      type='text'
                      title='page.accounts.liability.number'
                      help='page.accounts.liability.number.help'
                      value={ account.number }/>

          <Input.TextArea id='description'
                          title='Account.description'
                          value={ account.description }/>
        </fieldset>

        <div className='flex justify-end gap-2 mt-2'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default LiabilityForm
