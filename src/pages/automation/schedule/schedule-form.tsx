import { mdiCancel, mdiContentSave } from "@mdi/js";
import React, { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";
import Translation from "../../../components/localization/translation.component";
import { Message } from "../../../core";

import { TransactionScheduleRepository } from "../../../core/RestAPI";
import NotificationService from "../../../service/notification.service";

import '../../../assets/css/ScheduleTransactionForm.scss'

export const ScheduleForm = () => {
    const { id } = useParams()
    const [exception, setException] = useState()
    const navigate = useNavigate()
    const schedule = useLoaderData()

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
            .then(() => NotificationService.success('page.budget.schedule.edit.success'))
            .then(() => navigate(-1))
            .catch(setException)
    }

    if (!schedule) return <Loading/>
    return (
        <div className='ScheduleTransactionForm'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.accounting'/>
                <BreadCrumbItem label='page.nav.automation'/>
                <BreadCrumbItem label='page.nav.budget.recurring'/>
                <BreadCrumbItem label='page.title.schedule.transaction.edit'/>
            </BreadCrumbs>

            <Form entity='ScheduledTransaction' onSubmit={ onSubmit }>
                <Card title='page.title.schedule.transaction.edit'
                             buttons={ [
                                 <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                                 <BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>] }>

                    { exception && <Message message={ exception } variant='warning'/> }

                    <fieldset>
                        <legend><Translation label='page.budget.schedule.edit.meta'/></legend>
                        <Input.Text title='ScheduledTransaction.name'
                                    type='text'
                                    value={ schedule.name }
                                    required
                                    id='name'/>

                        <Input.TextArea title='ScheduledTransaction.description'
                                        value={ schedule.description }
                                        id='description'/>
                    </fieldset>

                    <fieldset>
                        <legend><Translation label='page.budget.schedule.edit.schedule'/></legend>
                        <Input.Text title='ScheduledTransaction.schedule'
                                    id='interval'
                                    value={ schedule.schedule.interval }
                                    type='number'
                                    required/>
                        <Input.Select id='periodicity'
                                      title='ScheduledTransaction.periodicity'
                                      value={ schedule.schedule.periodicity }
                                      required>
                            <Input.SelectOption label='Periodicity.WEEKS' value='WEEKS'/>
                            <Input.SelectOption label='Periodicity.MONTHS' value='MONTHS'/>
                            <Input.SelectOption label='Periodicity.YEARS' value='YEARS'/>
                        </Input.Select>

                        <Input.DateRange title='page.budget.schedule.daterange'
                                         id='range'
                                         value={ schedule.range }
                                         required/>
                    </fieldset>
                </Card>
            </Form>
        </div>
    )
}
