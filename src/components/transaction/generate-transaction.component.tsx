import { mdiContentSave, mdiLoading, mdiPageNext, mdiScriptTextOutline, mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import Icon from "@mdi/react";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import React, { RefObject, useEffect, useState } from "react";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import AccountRepository from "../../core/repositories/account-repository";
import { TransactionRepository } from "../../core/RestAPI";
import { Account, AccountRef, Transaction } from "../../types/types";
import DestinationInputComponent from "../account/transaction/destination-field.component";
import SourceInputComponent from "../account/transaction/source-input.component";
import { Form, Input, SubmitButton } from "../form";
import DateComponent from "../format/date.component";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";

type GeneratedTransaction = {
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER',
  date: string,
  from?: AccountRef,
  to?: AccountRef,
  description: string,
  amount: number,
}

export const GenerateTransaction = () => {
  const [visible, setVisible] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [generated, setGenerated] = useState<GeneratedTransaction>({} as GeneratedTransaction)
  const stepperRef = React.useRef<any>(null)
  const { httpError } = useNotification()

  const onSubmit = (data: any) => {
    setProcessing(true)
    setGenerated({} as GeneratedTransaction)
    TransactionRepository.extract(data)
      .then(response => {
        setGenerated(response)
        stepperRef.current?.nextCallback()
      })
      .catch(httpError)
      .finally(() => setProcessing(false))
  }

  const closeDialog = () => {
    setVisible(false)
    setGenerated({} as GeneratedTransaction)
  }

  return <>
    <Button label={ `page.transactions.generate` }
            severity='info'
            onClick={ () => setVisible(true) }
            icon={ mdiScriptTextOutline }/>

    <Dialog onHide={ closeDialog }
            header={ i10n('page.transactions.generate') }
            className='min-w-[30rem]'
            visible={ visible }>

      <Stepper ref={ stepperRef } linear>
        <StepperPanel header={ i10n('page.transactions.generate') }>
          <Form entity='Transaction' onSubmit={ onSubmit }>
            <Message severity='info' text={ i10n('page.transactions.generate.info') }/>

            <Input.TextArea id='fromText'
                            required
                            disabled={ processing }
                            title='Transaction.description'/>

            <div className='flex justify-end mt-4 items-center gap-2'>
              { processing && <Icon path={ mdiLoading } spin={ true } size={ 1 }/> }
              <SubmitButton label='page.transactions.process'
                            text
                            severity='success'
                            disabled={ processing }
                            icon={ mdiPageNext }/>
            </div>
          </Form>
        </StepperPanel>
        <StepperPanel header={ i10n('page.transactions.generated') }>
          <div className='max-w-[40em] mx-auto grid grid-cols-4 border-[1px] p-2 mb-4'>
            <div className='font-bold'>{ i10n('Transaction.date') }:</div>
            <div className='col-span-3'><DateComponent date={ generated.date }/></div>
            <div className='font-bold'>{ i10n('Transaction.type') }:</div>
            <div className='col-span-3'><Badge value={ generated.type } severity='info'/></div>
            <div className='font-bold'>{ i10n('Transaction.source') }:</div>
            <div className='col-span-3'>{ generated.from?.name }</div>
            <div className='font-bold'>{ i10n('Transaction.to') }:</div>
            <div className='col-span-3'>{ generated.to?.name }</div>
            <div className='font-bold'>{ i10n('Transaction.description') }:</div>
            <div className='col-span-3'>{ generated.description }</div>
            <div className='font-bold'>{ i10n('Transaction.amount') }:</div>
            <div className='col-span-3'><MoneyComponent money={ generated.amount }/></div>
          </div>
          <div className='flex justify-between'>
            <Button label='common.action.back'
                    size='small'
                    text
                    icon={ mdiSkipPrevious }
                    onClick={ () => stepperRef.current?.prevCallback() }
                    severity='secondary' />
            <Button label='page.transactions.generate.confirm'
                    size='small'
                    text
                    onClick={ () => stepperRef.current?.nextCallback() }
                    icon={ mdiSkipNext }
                    severity='success' />
          </div>
        </StepperPanel>
        <StepperPanel header={ i10n('page.transactions.add') }>
          <CreateTransactionPanel generated={ generated } stepperRef={ stepperRef } closeDialog={ closeDialog } />
        </StepperPanel>
      </Stepper>
    </Dialog>
  </>
}

function CreateTransactionPanel({ generated, stepperRef, closeDialog }: { generated: GeneratedTransaction, stepperRef: RefObject<any>, closeDialog: () => void }) {
  const [from, setFrom] = useState<Account | undefined>(undefined)
  const [to, setTo] = useState<Account | undefined>(undefined)
  const { success, warning } = useNotification()

  useEffect(() => {
    if (generated.from?.id) {
      AccountRepository.get(generated.from.id).then(setFrom)
    }
    if (generated.to?.id) {
      AccountRepository.get(generated.to.id).then(setTo)
    }

  }, [generated.from, generated.to])

  const onSubmit = (entity: any) => {
    const transaction = {
      description: entity.description,
      source: { id: entity.from.id, name: entity.from.name },
      destination: { id: entity.to.id, name: entity.to.name },
      amount: entity.amount,
      currency: entity.from.account.currency,
      date: entity.date
    }

    TransactionRepository.create(entity.from.id, transaction)
      .then(() => success('page.transaction.add.success'))
      .then(closeDialog)
      .catch(() => warning('page.transaction.add.failed'))
  }

  const accountFiller = {
    source: from,
    destination: to,
    type: {
      code: generated.type || 'CREDIT'
    }
  }

  if (!generated) return <></>
  return <>
    <Form entity='Transaction' onSubmit={ onSubmit }>
      <Input.Text id='description'
                  type='text'
                  value={ generated.description }
                  title='Transaction.description'
                  required/>

      <div className='md:flex gap-4'>
        <Input.Amount id='amount'
                      className='flex-1'
                      value={ generated.amount }
                      title='Transaction.amount'
                      currency={ (from || to)?.account?.currency || 'EUR' }
                      required/>

        <Input.Date id='date'
                    className='flex-1'
                    value={ generated.date }
                    title='Transaction.date'
                    required/>
      </div>

      <SourceInputComponent transaction={ accountFiller as Transaction } className='flex-1'/>
      <DestinationInputComponent transaction={ accountFiller as Transaction } className='flex-1'/>


      <div className='flex justify-between pt-2'>
        <Button label='common.action.back'
                size='small'
                text
                icon={ mdiSkipPrevious }
                onClick={ () => stepperRef.current?.prevCallback() }
                severity='secondary' />
        <SubmitButton label='common.action.save' size='small' icon={ mdiContentSave }/>
      </div>
    </Form>
  </>
}
