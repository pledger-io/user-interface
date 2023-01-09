import React, {useState} from "react";

import {Entity, Form, Input, SubmitButton} from '../../core/form'
import {Buttons, Dialog, Message, Notifications, Translations} from "../../core";
import {mdiCalendarCheck, mdiContentSave} from "@mdi/js";
import {EntityShapes} from "../../config";
import {TransactionScheduleRepository} from "../../core/RestAPI";

import '../../assets/css/ScheduleTransactionDialog.scss'

const createScheduleEntity = entity => {
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

export const ScheduleTransactionDialog = ({transaction}) => {
    const [type, setType] = useState(transaction?.type.code.toLowerCase() || 'credit')

    const dialogHandler = {
        close: () => {}
    }
    const onSubmit = entity => TransactionScheduleRepository.create(createScheduleEntity(entity))
            .then(() => Notifications.Service.success('popup.schedule.transaction.create.success'))
            .then(() => dialogHandler.close())
            .catch(() => Notifications.Service.warning('popup.schedule.transaction.create.failed'))

    return (
        <Form onSubmit={onSubmit} entity='ScheduledTransaction'>
            <Dialog.Dialog title='page.title.schedule.transaction.add'
                           control={dialogHandler}
                           className='ScheduleTransaction'
                           actions={[
                               <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>
                           ]}
                           openButton={<Buttons.Button label='page.transaction.action.recurring'
                                                       variantType='outline'
                                                       icon={mdiCalendarCheck}/>}>
                <Message label='page.budget.schedule.explained' variant='info'/>

                <fieldset>
                    <legend><Translations.Translation label='popup.schedule.transaction.info'/></legend>
                    <Input.Text id='name'
                                title='ScheduledTransaction.name'
                                value={transaction?.description}
                                required />

                    <Input.Text title='ScheduledTransaction.amount'
                                id='amount'
                                type='number'
                                value={transaction?.amount}
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
                    <legend><Translations.Translation label='popup.schedule.transaction.accounts'/></legend>

                    { type === 'debit' && <Entity.Account id='from'
                                                          type='debtor'
                                                          value={transaction?.source}
                                                          required
                                                          title='ScheduledTransaction.source'/>}
                    { type !== 'debit' && <Entity.ManagedAccount id='from'
                                                                 required
                                                                 value={transaction?.source}
                                                                 title='ScheduledTransaction.source'/>}

                    { type === 'credit' && <Entity.Account id='to'
                                                           type='creditor'
                                                           value={transaction?.destination}
                                                           required
                                                           title='ScheduledTransaction.destination'/>}
                    { type !== 'credit' && <Entity.ManagedAccount id='to'
                                                                  required
                                                                  value={transaction?.destination}
                                                                  title='ScheduledTransaction.destination'/>}

                    <Input.RadioButtons id='type'
                                        onChange={setType}
                                        value={type}
                                        options={[
                                            {label: 'common.transfer', value:'transfer', variant: 'primary'},
                                            {label: 'common.credit', value:'credit', variant: 'warning'},
                                            {label: 'common.debit', value:'debit', variant: 'success'}]}/>
                </fieldset>
            </Dialog.Dialog>
        </Form>
    )
}
ScheduleTransactionDialog.propTypes = {
    transaction: EntityShapes.Transaction
}
