import React from "react";

import {Input, Form, Entity, SubmitButton} from '../../core/form'
import {Buttons, Dialog, Message, Notifications, Translations} from "../../core";
import {mdiCalendarCheck, mdiContentSave} from "@mdi/js";
import {EntityShapes} from "../../config";
import restAPI from "../../core/RestAPI";

import '../../assets/css/ScheduleTransactionDialog.scss'

class ScheduleService {
    create(entity) {
        return restAPI.put('schedule/transaction', entity)
    }
}
const service = new ScheduleService();

export class ScheduleTransactionDialog extends React.Component {
    static propTypes = {
        transaction: EntityShapes.Transaction
    }

    dialogHandler = {
        close: () => {}
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            type: props.transaction?.type.code.toLowerCase() || 'credit'
        }

    }

    process(entity) {
        const scheduleEntity = {
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

        service.create(scheduleEntity)
            .then(() => Notifications.Service.success('popup.schedule.transaction.create.success'))
            .then(() => this.dialogHandler.close())
            .catch(() => Notifications.Service.warning('popup.schedule.transaction.create.failed'))
    }

    render() {
        const {transaction} = this.props
        const {type} = this.state

        return (
            <Form onSubmit={this.process.bind(this)} entity='ScheduledTransaction'>
                <Dialog.Dialog title='page.title.schedule.transaction.add'
                               control={this.dialogHandler}
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

                        {this.renderSourceAccount()}
                        {this.renderDestinationAccount()}

                        <Input.RadioButtons id='type'
                                            onChange={value => this.setState({type: value})}
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

    renderSourceAccount() {
        const {type} = this.state
        const {transaction: {source, type: {code}} = {type: {}}} = this.props

        if ((type || code.toLowerCase()) === 'debit') {
            return <Entity.Account id='from'
                                  type='debtor'
                                  value={source}
                                  required
                                  title='ScheduledTransaction.source'/>
        }

        return <Entity.ManagedAccount id='from'
                                    required
                                    value={source}
                                    title='ScheduledTransaction.source'/>
    }

    renderDestinationAccount() {
        const {type} = this.state
        const {transaction: {destination, type: {code}} = {type: {}}} = this.props

        if ((type || code.toLowerCase()) === 'credit') {
            return <Entity.Account id='to'
                                  type='creditor'
                                  value={destination}
                                  required
                                  title='ScheduledTransaction.destination'/>
        }

        return <Entity.ManagedAccount id='to'
                                    required
                                    value={destination}
                                    title='ScheduledTransaction.destination'/>
    }
}
