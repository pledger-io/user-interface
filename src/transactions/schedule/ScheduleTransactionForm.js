import React, { useEffect, useState } from "react";

import { Form, Input, SubmitButton } from "../../core/form";
import { useNavigate, useParams } from "react-router-dom";
import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Message, Notifications, Translations } from "../../core";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { TransactionScheduleRepository } from "../../core/RestAPI";

import '../../assets/css/ScheduleTransactionForm.scss'

export const ScheduleTransactionForm = () => {
    const { id }                      = useParams()
    const [schedule, setSchedule]   = useState()
    const [exception, setException] = useState()
    const navigate                  = useNavigate()

    useEffect(() => {
        TransactionScheduleRepository.get(id)
            .then(setSchedule)
    }, [id])

    const onSubmit = entity => {
        TransactionScheduleRepository.update(id, {
            name: entity.name,
            description: entity.description,
            schedule: {
                periodicity: entity.periodicity,
                interval: entity.interval
            },
            range: entity.range
        })
            .then(() => Notifications.Service.success('page.budget.schedule.edit.success'))
            .then(() => navigate(-1))
            .catch(setException)
    }

    if (!schedule) return <Layout.Loading />
    return (
        <div className='ScheduleTransactionForm'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.accounting'/>
                <BreadCrumbItem label='page.nav.automation'/>
                <BreadCrumbItem label='page.nav.budget.recurring'/>
                <BreadCrumbItem label='page.title.schedule.transaction.edit'/>
            </BreadCrumbs>

            <Form entity='ScheduledTransaction' onSubmit={onSubmit}>
                <Layout.Card title='page.title.schedule.transaction.edit'
                      buttons={[
                          <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                          <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>

                    {exception && <Message message={exception} variant='warning'/>}

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

                        <Input.DateRange title='page.budget.schedule.daterange'
                                         id='range'
                                         value={schedule.range}
                                         required/>
                    </fieldset>
                </Layout.Card>
            </Form>
        </div>
    )
}
