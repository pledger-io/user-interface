import React from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Entity, Form, Input, SubmitButton } from "../../components/form";
import { useNotification } from "../../context/notification-context";
import ContractRepository from "../../core/repositories/contract-repository";
import { BackButton } from "../../components/layout/button";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import { Contract } from "../../types/types";
import { Card } from "primereact/card";
import { i10n } from "../../config/prime-locale";

const ContractEdit = () => {
  const { id } = useParams()
  const contract: Contract = useLoaderData()
  const navigate = useNavigate()
  const { warning, success } = useNotification()

  const onSubmit = (entity: any) => {
    if (id) {
      ContractRepository.update(id, entity)
        .then(() => success('page.budget.contracts.updated.success'))
        .then(() => navigate(-1))
        .catch(() => warning('page.budget.contracts.updated.failed'))
    } else {
      ContractRepository.create(entity)
        .then(() => success('page.budget.contracts.created.success'))
        .then(() => navigate(-1))
        .catch(() => warning('page.budget.contracts.created.failed'))
    }
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n(!id ? 'page.budget.contracts.add' : 'page.budget.contracts.edit') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.finances'/>
      <BreadCrumbItem label='page.nav.budget.contracts' href='/contracts'/>
      <BreadCrumbItem message={ contract?.name }/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <Form entity='Contract' onSubmit={ onSubmit }>
        <Input.Text id='name'
                    value={ contract?.name }
                    title='Contract.name'
                    type='text'
                    required/>

        <Entity.Account id='company'
                        title='Contract.company'
                        type='creditor'
                        required
                        value={ contract?.company }/>

        <div className='md:flex gap-4'>
          <Input.Date id='start'
                      className='flex-1'
                      value={ contract?.start }
                      required
                      title='Contract.start'/>
          <Input.Date id='end'
                      className='flex-1'
                      value={ contract?.end }
                      required
                      title='Contract.end'/>
        </div>

        <Input.TextArea id='description'
                        value={ contract?.description }
                        title='Contract.description'/>

        <div className='flex justify-end gap-2 mt-2'>
          <BackButton label='common.action.cancel' icon={ mdiCancel }/>
          <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
        </div>
      </Form>
    </Card>
  </>
}

export default ContractEdit
