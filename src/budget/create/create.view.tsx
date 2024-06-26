import { BreadCrumbItem, BreadCrumbs, Message, Notifications } from "../../core";
import { Form, Input, SubmitButton } from "../../core/form";
import { mdiContentSave } from "@mdi/js";
import React from "react";
import BudgetRepository from "../../core/repositories/budget.repository";
import { useNavigate } from "react-router-dom";

import Card from "../../components/layout/card.component";

const CreateBudgetView = () => {
    const navigate = useNavigate()

    const onSubmit = (data: any) => {
        const date = new Date(data.startDate)
        BudgetRepository.create({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            income: data.income
        })
            .then(() => Notifications.Service.success('page.budget.group.created'))
            .then(() => navigate('/budgets'))
            .catch(() => Notifications.Service.warning('page.budget.group.create.failed'))
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
                <Message type='info' label='page.budget.group.explained' />

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