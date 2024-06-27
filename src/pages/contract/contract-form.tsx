import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mdiCancel, mdiContentSave } from "@mdi/js";

import { BreadCrumbItem, BreadCrumbs, Buttons, Notifications } from "../../core";
import { Contract } from "../../core/types";
import { Entity, Form, Input, SubmitButton } from "../../core/form";
import ContractRepository from "../../core/repositories/contract-repository";

import Loading from "../../components/layout/loading.component";
import Card from "../../components/layout/card.component";
import { BackButton } from "../../components/layout/button";

const ContractEdit = () => {
    const { id } = useParams()
    const [contract, setContract] = useState<Contract>()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            ContractRepository.get(id)
                .then(setContract)
        } else {
            setContract({} as Contract)
        }
    }, [id]);

    const onSubmit = (entity: any) => {
        if (id) {
            ContractRepository.update(id, entity)
                .then(() => Notifications.Service.success('page.budget.contracts.updated.success'))
                .then(() => navigate(-1))
                .catch(() => Notifications.Service.success('page.budget.contracts.updated.failed'))
        } else {
            ContractRepository.create(entity)
                .then(() => Notifications.Service.success('page.budget.contracts.created.success'))
                .then(() => navigate(-1))
                .catch(() => Notifications.Service.success('page.budget.contracts.created.failed'))
        }
    }

    const editLabel = !id ? 'page.budget.contracts.add' : 'page.budget.contracts.edit'
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.finances'/>
            <BreadCrumbItem label='page.nav.budget.contracts' href='/contracts'/>
            <BreadCrumbItem message={ contract?.name }/>
        </BreadCrumbs>
        <Loading condition={ contract !== undefined }>
            <Form entity='Contract' onSubmit={ onSubmit }>
                <Card title={ editLabel }
                             buttons={[
                                 <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                                 <BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>]}>

                    <Input.Text id='name'
                                value={ contract?.name }
                                title='Contract.name'
                                type='text'
                                required/>

                    <Entity.Account id='company'
                                    title='Contract.company'
                                    type='CREDITOR'
                                    required
                                    value={ contract?.company }/>

                    <Input.Date id='start'
                                value={ contract?.start }
                                required
                                title='Contract.start'/>
                    <Input.Date id='end'
                                value={ contract?.end }
                                required
                                title='Contract.end'/>

                    <Input.TextArea id='description'
                                    value={ contract?.description }
                                    title='Contract.description' />
                </Card>
            </Form>
        </Loading>
    </>
}

export default ContractEdit