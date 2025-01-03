import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../components/form";
import { mdiContentSave } from "@mdi/js";
import React from "react";
import Message from "../../components/layout/message.component";
import BudgetRepository from "../../core/repositories/budget.repository";
import { useNavigate } from "react-router";

import Card from "../../components/layout/card.component";
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

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.finances' />
            <BreadCrumbItem label='page.nav.budget.groups' />
            <BreadCrumbItem label='page.nav.budget.initial.setup' />
        </BreadCrumbs>

        <Form entity='Budget' onSubmit={ onSubmit }>
            <Card title='page.nav.budget.initial.setup'
                         className='max-w-2xl mx-auto'
                         buttons={[
                             <SubmitButton key='save' label='page.budget.group.action.initial' icon={ mdiContentSave }/>,
                         ]}>
                <Message variant='info' label='page.budget.group.explained' />

                <Input.Month id='startDate'
                             required
                             title='page.budget.group.start'
                            />

                <Input.Amount id='income'
                              required
                              title='Budget.expectedIncome' />
            </Card>
        </Form>
    </>
}

export default CreateBudgetView