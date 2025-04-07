import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Dialog } from "primereact/dialog";
import React, { Attributes, FC, Ref, useImperativeHandle, useState } from "react";
import Message from "../../components/layout/message.component";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";

import { TransactionScheduleRepository } from "../../core/RestAPI";
import { DialogOptions, Transaction } from "../../types/types";
import { Entity, Form, Input, SubmitButton } from "../form";
import { Button } from "../layout/button";

const createScheduleEntity = (entity: any) => {
  return {
    name: entity.name,
    amount: entity.amount,
    source: {
      id: entity.from.id,
      name: entity.from.name
    },
    destination: {
      id: entity.to.id,
      name: entity.to.name
    },
    schedule: {
      periodicity: entity.periodicity,
      interval: parseInt(entity.interval)
    }
  }
}

type ScheduleTransactionDialogProps = Attributes & {
  transaction?: Transaction,
  onCreated?: () => void,
  iconStyle?: boolean
  ref: Ref<DialogOptions>
}

const ScheduleTransactionDialog: FC<ScheduleTransactionDialogProps> = ({ ref, transaction, onCreated }) => {
  const [type, setType] = useState(transaction?.type.code.toLowerCase() || 'credit')
  const [visible, setVisible] = useState<boolean>(false)
  const { success, warning } = useNotification();

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    }
  }));

  const onSubmit = (entity: any) => TransactionScheduleRepository.create(createScheduleEntity(entity))
    .then(() => success('popup.schedule.transaction.create.success'))
    .then(() => onCreated && onCreated())
    .then(() => setVisible(false))
    .catch(() => warning('popup.schedule.transaction.create.failed'))

  return (
    <Dialog header={ i10n('page.title.schedule.transaction.add') }
            onHide={ () => setVisible(false) }
            className='max-w-[35rem]'
            visible={ visible }>
      <Form onSubmit={ onSubmit } entity='ScheduledTransaction'>
        <Message label='page.budget.schedule.explained' variant='info'/>

        <fieldset>
          <legend className='font-bold text-xl underline'>{ i10n('popup.schedule.transaction.info') }</legend>
          <Input.Text id='name'
                      type='text'
                      title='ScheduledTransaction.name'
                      value={ transaction?.description }
                      required/>

          <Input.Text title='ScheduledTransaction.amount'
                      id='amount'
                      type='number'
                      value={ transaction?.amount }
                      required/>

          <div className='md:flex gap-4'>
            <Input.Text title='ScheduledTransaction.schedule'
                        id='interval'
                        type='number'
                        className='md:flex-1'
                        required/>

            <Input.Select id='periodicity'
                          title='ScheduledTransaction.periodicity'
                          className='flex-1'
                          value='MONTHS'
                          options={ [
                            { label: 'Periodicity.WEEKS', value: 'WEEKS' },
                            { label: 'Periodicity.MONTHS', value: 'MONTHS' },
                            { label: 'Periodicity.YEARS', value: 'YEARS' }
                          ] }
                          required/>
          </div>
        </fieldset>

        <fieldset className='my-4'>
          <legend className='font-bold text-xl underline'>{ i10n('popup.schedule.transaction.accounts') }</legend>

          { type === 'debit' && <Entity.Account id='from'
                                                type='debtor'
                                                value={ transaction?.source }
                                                required
                                                title='ScheduledTransaction.source'/> }
          { type !== 'debit' && <Entity.ManagedAccount id='from'
                                                       required
                                                       value={ transaction?.source }
                                                       title='ScheduledTransaction.source'/> }

          { type === 'credit' && <Entity.Account id='to'
                                                 type='creditor'
                                                 value={ transaction?.destination }
                                                 required
                                                 title='ScheduledTransaction.destination'/> }
          { type !== 'credit' && <Entity.ManagedAccount id='to'
                                                        required
                                                        value={ transaction?.destination }
                                                        title='ScheduledTransaction.destination'/> }

          <Input.RadioButtons id='type'
                              className='mt-4 w-full'
                              onChange={ setType }
                              value={ type }
                              options={ [
                                { label: 'common.transfer', value: 'transfer', variant: 'primary' },
                                { label: 'common.credit', value: 'credit', variant: 'warning' },
                                { label: 'common.debit', value: 'debit', variant: 'success' }] }/>
        </fieldset>

        <div className='flex gap-1 justify-end mt-4'>
          <Button label='common.action.cancel'
                  text
                  type='reset'
                  severity='secondary'
                  onClick={ () => setVisible(false) }
                  icon={ mdiCancel }/>
          <SubmitButton label='common.action.save'
                        icon={ mdiContentSave }
                        data-testid={ `schedule-transaction-submit-${ transaction?.id || 1 }` }/>
        </div>
      </Form>
    </Dialog>
  )
}

export default ScheduleTransactionDialog
