import { mdiSkipNext } from "@mdi/js";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import React, { useEffect, useState } from "react";
import { i10n } from "../../config/prime-locale";
import AccountRepository from "../../core/repositories/account-repository";
import ProcessRepository, {
  ProcessTask,
  TaskVariable,
  TaskVariables
} from "../../core/repositories/process.repository";
import NotificationService from "../../service/notification.service";
import { AccountRef, Identifier } from "../../types/types";
import { Entity, Form, Input, SubmitButton } from "../form";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import Translation from "../localization/translation.component";

type AccountCreated = TaskVariable & {
  value: Identifier
}

type TransactionDetails = {
  amount: number,
  type: string,
  description: string,
  transactionDate: string,
  opposingName: string
}

const _ = ({ task }: { task: ProcessTask }) => {
  const [transaction, setTransaction] = useState<TransactionDetails>()
  const [assetAccount, setAssetAccount] = useState<boolean>(true)

  useEffect(() => {
    ProcessRepository.taskVariables('import_job', task.id, 'transaction')
      .then(({ variables }) => {
        const transaction: TransactionDetails = variables.transaction.value
        setTransaction(transaction)
      })
  }, [task]);

  const onSubmit = (data: any) => {
    AccountRepository.create({ name: data.name, currency: data.currency, type: data.type })
      .then(account => {
        const accountCreated: TaskVariables = {
          variables: {
            accountId: {
              '_type': 'com.jongsoft.finance.rest.process.VariableMap$WrappedVariable',
              value: account.id
            } as AccountCreated
          }
        }
        ProcessRepository.completeTasksVariables('import_job', task.id, accountCreated)
          .then(() => document.location.reload())
          .catch(() => NotificationService.warning('page.user.profile.import.error'))
      })
      .catch(() => NotificationService.warning('page.user.profile.import.error'))
  }

  const continueWithAccount = ({ account }: { account: AccountRef }) => {
    const accountCreated: TaskVariables = {
      variables: {
        accountId: {
          '_type': 'com.jongsoft.finance.rest.process.VariableMap$WrappedVariable',
          value: account.id
        } as AccountCreated
      }
    }

    ProcessRepository.completeTasksVariables('import_job', task.id, accountCreated)
      .then(() => document.location.reload())
      .catch(() => NotificationService.warning('page.user.profile.import.error'))
  }

  if (!transaction) return <Loading/>
  return <>
    <div className='max-w-[40em] mx-auto mb-4'>
        <Message severity='info'
                 text={ i10n('page.user.profile.import.account.lookup.info') }/>
    </div>

    <div className='max-w-[40em] mx-auto grid grid-cols-4 border-[1px] p-2 mb-4'>
      <div className='col-span-4 text-center font-extrabold'><Translation label='page.transaction.add.details'/></div>
      <div className='font-bold'><Translation label='page.account.accounts.accountdetails'/>:</div>
      <div className='col-span-3'>{ transaction.opposingName }</div>
      <div className='font-bold'><Translation label='Transaction.description'/>:</div>
      <div className='col-span-3'>{ transaction.description }</div>
      <div className='font-bold'><Translation label='Transaction.amount'/>:</div>
      <div className='col-span-3'><MoneyComponent money={ transaction.amount }/></div>
    </div>

    <Form entity='' onSubmit={ continueWithAccount }>
      <fieldset className='max-w-[40em] mx-auto'>
        <legend className='font-bold text-xl underline'>{ i10n('page.user.profile.import.account.lookup') }</legend>
        <Entity.Account id='account'
                        title='Account.name'
                        inputOnly={ true }
                        required={ true }/>

        <div className='flex justify-end mt-4'>
          <SubmitButton label='common.action.next' icon={ mdiSkipNext } />
        </div>
      </fieldset>
    </Form>

    <div className='max-w-[45em] mx-auto mt-4'>
      <Divider />
    </div>

    <Form entity='' onSubmit={ onSubmit }>
      <fieldset className='max-w-[40em] mx-auto'>
        <legend className='font-bold text-xl underline'>{ i10n('page.title.accounts.add') }</legend>
        <Input.Text id='name'
                    value={ transaction.opposingName }
                    title='Account.name'
                    help='Account.name.help'
                    type='text'
                    required={ true }/>

        <Entity.Currency id='currency'
                         title='Account.currency'
                         required/>

        <div className='flex mb-2'>
          <span className='flex-auto max-w-full md-max-w-[15vw]'/>
          <span className='flex-3 flex gap-3'>
                        <Input.Toggle id='ownAccount'
                                      onChange={ () => setAssetAccount(!assetAccount) }
                                      value={ true }/>
                        <Translation label='page.nav.accounts.accounts'/>
                    </span>
        </div>

        { assetAccount && <Entity.AccountType id='type'
                                              title='Account.type'
                                              required/> }

        { !assetAccount &&
          <span className='flex mb-2'>
            <span className='flex-auto max-w-full md-max-w-[15vw]'/>

            <span className='flex-3'>
                <Input.RadioButtons id='type'
                                    value='creditor'
                                    options={ [
                                      {
                                        label: 'common.credit',
                                        value: 'creditor',
                                        variant: 'warning'
                                      },
                                      {
                                        label: 'common.debit',
                                        value: 'debtor',
                                        variant: 'success'
                                      }] }/>
            </span>
          </span> }

        <div className='flex justify-end mt-4'>
          <SubmitButton label='common.action.next' icon={ mdiSkipNext } />
        </div>
      </fieldset>
    </Form>
  </>
}

export default _;
