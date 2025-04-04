import { mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import React from "react";
import { useNavigate } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import BudgetRepository from "../../core/repositories/budget.repository";
import NotificationService from "../../service/notification.service";

const CreateBudgetView = () => {
  const navigate = useNavigate()

  const onSubmit = (data: any) => {
    const date = new Date(data.startDate)
    BudgetRepository.create({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      income: data.income
    })
      .then(() => NotificationService.success('page.budget.group.created'))
      .then(() => navigate('/budgets'))
      .catch(() => NotificationService.warning('page.budget.group.create.failed'))
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.nav.budget.initial.setup') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.finances'/>
      <BreadCrumbItem label='page.nav.budget.groups'/>
      <BreadCrumbItem label='page.nav.budget.initial.setup'/>
    </BreadCrumbs>

    <Card header={ header }
          className='max-w-2xl mx-auto my-auto'>
      <Form entity='Budget' onSubmit={ onSubmit }>

        <Message severity='info' text={ i10n('page.budget.group.explained') }/>

        <Input.Date id='startDate'
                    view='year'
                    required={ true }
                    title='page.budget.group.start'/>

        <Input.Amount id='income'
                      required
                      title='Budget.expectedIncome'/>

        <div className='flex justify-end mt-4'>
          <SubmitButton key='save' label='page.budget.group.action.initial' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default CreateBudgetView
