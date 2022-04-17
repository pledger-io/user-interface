import React from "react";

import {Form, Input, SubmitButton} from "../../core/form";
import {Buttons, Card, Loading, Message, Notifications, Translations} from "../../core";
import {mdiCancel, mdiContentSave} from "@mdi/js";
import {PathParams} from "../../core/hooks";
import restAPI from "../../core/RestAPI";

import '../../assets/css/ScheduleTransactionForm.scss'

export class ScheduleTransactionForm extends React.Component {
    static contextType = PathParams

    state = {
        id: NaN,
        schedule: null
    }

    constructor(props, context) {
        super(props, context);

        this.context.resolved = ({id}) => {
            restAPI.get(`schedule/transaction/${id}`)
                .then(schedule => this.setState({
                    id: id,
                    schedule: schedule
                }))
        }
    }

    process(entity) {
        const {id} = this.state
        const {navigate} = this.props
        const schedule = {
            name: entity.name,
            description: entity.description,
            schedule: {
                periodicity: entity.periodicity,
                interval: entity.interval
            },
            range: {
                start: entity.start,
                end: entity.end
            }
        }

        restAPI.patch(`schedule/transaction/${id}`, schedule)
            .then(() => Notifications.Service.success('page.budget.schedule.edit.success'))
            .then(() => navigate(-1))
            .catch(exception => this.setState({
                ...this.state,
                exception: exception
            }))
    }

    render() {
        const {schedule, exception = null} = this.state
        if (schedule === null) {
            return <Loading />
        }

        return (
            <div className='ScheduleTransactionForm'>
                <Form entity='ScheduledTransaction' onSubmit={entity => this.process(entity)}>
                    <Card title='page.title.schedule.transaction.edit'
                          buttons={[
                              <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                              <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>

                        {exception !== null && <Message message={exception} variant='warning'/>}

                        <fieldset>
                            <legend><Translations.Translation label='page.budget.schedule.edit.meta'/></legend>
                            <Input.Text title='ScheduledTransaction.name'
                                        value={schedule.name}
                                        required
                                        id='name'/>

                            <Input.TextArea title='ScheduledTransaction.description'
                                            value={schedule.description}
                                            id='description'/>
                        </fieldset>

                        <fieldset>
                            <legend><Translations.Translation label='page.budget.schedule.edit.schedule'/></legend>
                            <Input.Text title='ScheduledTransaction.schedule'
                                        id='interval'
                                        value={schedule.schedule.interval}
                                        type='number'
                                        required/>
                            <Input.Select id='periodicity'
                                          title='ScheduledTransaction.periodicity'
                                          value={schedule.schedule.periodicity}
                                          required>
                                <Input.SelectOption label='Periodicity.WEEKS' value='WEEKS'/>
                                <Input.SelectOption label='Periodicity.MONTHS' value='MONTHS'/>
                                <Input.SelectOption label='Periodicity.YEARS' value='YEARS'/>
                            </Input.Select>

                            <div className="DateRange">
                                <Input.Date title='ScheduledTransaction.start'
                                            value={schedule.range.start}
                                             id='start'
                                             required/>
                                <Input.Date title='ScheduledTransaction.end'
                                             id='end'
                                            value={schedule.range.end}
                                            required/>
                            </div>
                        </fieldset>
                    </Card>
                </Form>
            </div>
        )
    }
}
