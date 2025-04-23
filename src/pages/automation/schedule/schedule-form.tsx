import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import React, { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../../components/form";
import { BackButton } from "../../../components/layout/button";
import Loading from "../../../components/layout/loading.component";
import { i10n } from "../../../config/prime-locale";
import { useNotification } from "../../../context/notification-context";
import { TransactionScheduleRepository } from "../../../core/RestAPI";

const TransactionScheduleForm = () => {
  const { id } = useParams()
  const [exception, setException] = useState()
  const navigate = useNavigate()
  const { success } = useNotification()
  const schedule: any = useLoaderData()

  const onSubmit = (entity: any) => {
    TransactionScheduleRepository.update(id, {
      name: entity.name,
      description: entity.description,
      schedule: {
        periodicity: entity.periodicity,
        interval: entity.interval
      },
      range: entity.range
    })
      .then(() => success('page.budget.schedule.edit.success'))
      .then(() => navigate(-1))
      .catch(setException)
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.title.schedule.transaction.edit') }
  </div>

  if (!schedule) return <Loading/>
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.accounting'/>
      <BreadCrumbItem label='page.nav.automation'/>
      <BreadCrumbItem label='page.nav.budget.recurring'/>
      <BreadCrumbItem label='page.title.schedule.transaction.edit'/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <Form entity='ScheduledTransaction' onSubmit={ onSubmit }>

        { exception && <Message text={ exception } severity='warn'/> }

        <fieldset>
          <legend className='font-bold text-xl underline'>{ i10n('page.budget.schedule.edit.meta') }</legend>
          <Input.Text title='ScheduledTransaction.name'
                      type='text'
                      value={ schedule.name }
                      required
                      id='name'/>

          <Input.TextArea title='ScheduledTransaction.description'
                          value={ schedule.description }
                          id='description'/>
        </fieldset>

        <fieldset className='my-4'>
          <legend className='font-bold text-xl underline'>{ i10n('page.budget.schedule.edit.schedule') }</legend>

          <div className='md:flex gap-4'>
            <Input.Text title='ScheduledTransaction.schedule'
                        id='interval'
                        type='number'
                        value={ schedule.schedule.interval }
                        className='md:flex-1'
                        required/>

            <Input.Select id='periodicity'
                          title='ScheduledTransaction.periodicity'
                          className='flex-1'
                          value={ schedule.schedule.periodicity }
                          options={ [
                            { label: 'Periodicity.WEEKS', value: 'WEEKS' },
                            { label: 'Periodicity.MONTHS', value: 'MONTHS' },
                            { label: 'Periodicity.YEARS', value: 'YEARS' }
                          ] }
                          required/>
          </div>

          <Input.DateRange title='page.budget.schedule.daterange'
                           id='range'
                           value={ schedule.range }
                           required/>
        </fieldset>

        <div className='flex justify-end gap-2 mt-4'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default TransactionScheduleForm
