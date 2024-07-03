import { mdiCalendarCheck, mdiContentSave } from "@mdi/js";
import React, { Attributes, useState } from "react";
import Message from "../../components/layout/message.component";

import { TransactionScheduleRepository } from "../../core/RestAPI";
import { Transaction } from "../../core/types";
import NotificationService from "../../service/notification.service";
import { Entity, Form, Input, SubmitButton } from "../form";
import { Button } from "../layout/button";
import { Dialog } from "../layout/popup";
import { PopupCallbacks } from "../layout/popup/popup.component";
import Translation from "../localization/translation.component";

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
}

const ScheduleTransactionDialog = ({ transaction, onCreated = () => {}, iconStyle = false } : ScheduleTransactionDialogProps) => {
    const [type, setType] = useState(transaction?.type.code.toLowerCase() || 'credit')

    const dialogHandler: PopupCallbacks = { close: () => {}, open: () => {} }
    const onSubmit = (entity: any) => TransactionScheduleRepository.create(createScheduleEntity(entity))
        .then(() => NotificationService.success('popup.schedule.transaction.create.success'))
        .then(() => onCreated && onCreated())
        .then(() => dialogHandler.close())
        .catch(() => NotificationService.warning('popup.schedule.transaction.create.failed'))

    return (
        <Form onSubmit={ onSubmit } entity='ScheduledTransaction'>
            <Dialog title='page.title.schedule.transaction.add'
                    control={ dialogHandler }
                    className='ScheduleTransaction'
                    actions={ [
                        <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>
                    ] }
                    openButton={ <Button label='page.transaction.action.recurring'
                                         variant={ iconStyle ? 'icon' : 'primary' }
                                         icon={ mdiCalendarCheck }/> }>
                <Message label='page.budget.schedule.explained' variant='info'/>

                <fieldset>
                    <legend><Translation label='popup.schedule.transaction.info'/></legend>
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

                    <Input.Text title='ScheduledTransaction.schedule'
                                id='interval'
                                type='number'
                                required/>
                    <Input.Select id='periodicity'
                                  title='ScheduledTransaction.periodicity'
                                  value='MONTHS'
                                  required>
                        <Input.SelectOption label='Periodicity.WEEKS' value='WEEKS'/>
                        <Input.SelectOption label='Periodicity.MONTHS' value='MONTHS'/>
                        <Input.SelectOption label='Periodicity.YEARS' value='YEARS'/>
                    </Input.Select>
                </fieldset>

                <fieldset>
                    <legend><Translation label='popup.schedule.transaction.accounts'/></legend>

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
                                        onChange={ setType }
                                        value={ type }
                                        options={ [
                                            { label: 'common.transfer', value: 'transfer', variant: 'primary' },
                                            { label: 'common.credit', value: 'credit', variant: 'warning' },
                                            { label: 'common.debit', value: 'debit', variant: 'success' }] }/>
                </fieldset>
            </Dialog>
        </Form>
    )
}

export default ScheduleTransactionDialog