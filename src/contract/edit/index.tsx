import React, {FC, useEffect, useState} from "react";
import {BreadCrumbItem, BreadCrumbs, Buttons, Layout, Notifications} from "../../core";
import {useNavigate, useParams} from "react-router-dom";
import ContractRepository from "../../core/repositories/contract-repository";
import {Contract} from "../../core/types";
import {Entity, Form, Input, SubmitButton} from "../../core/form";
import {mdiCancel, mdiContentSave} from "@mdi/js";

const ContractEdit: FC<void> = () => {
    const { id } = useParams()
    const [contract, setContract] = useState<Contract>()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            ContractRepository.get(parseInt(id))
                .then(setContract)
        } else {
            setContract({} as Contract)
        }
    }, [id]);

    const onSubmit = (entity: any) => {
        if (id) {
            ContractRepository.update(parseInt(id), entity)
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
        <Layout.Loading condition={ contract !== undefined }>
            <Form entity='Contract' onSubmit={ onSubmit }>
                <Layout.Card title={ editLabel }
                             buttons={[
                                 <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                                 <Buttons.BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>]}>

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
                </Layout.Card>
            </Form>
        </Layout.Loading>
    </>
}

export default ContractEdit