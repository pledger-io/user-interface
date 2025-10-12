import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../components/form";
import { BackButton } from "../../components/layout/button";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import CategoryRepository from "../../core/repositories/category-repository";
import { Category } from "../../types/types";

const CategoryForm = () => {
  const [category, setCategory] = useState<Category>({} as Category)
  const [exception, setException] = useState()
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, warning } = useNotification()

  useEffect(() => {
    if (id) CategoryRepository.get(id).then(setCategory)
  }, [id])

  const onSubmit = (entity: any) => {
    if (id)
      CategoryRepository.update(id, entity)
        .then(() => success('page.category.create.success'))
        .then(() => navigate(-1))
        .catch(e => {
          setException(e)
          warning('page.category.create.failed')
        })
    else
      CategoryRepository.create(entity)
        .then(() => success('page.category.update.success'))
        .then(() => navigate(-1))
        .catch(e => {
          setException(e)
          warning('page.category.update.failed')
        })
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.settings.categories.add') }
  </div>

  return (
    <>
      <BreadCrumbs>
        <BreadCrumbItem label='page.nav.settings'/>
        <BreadCrumbItem label='page.nav.settings.categories'/>
      </BreadCrumbs>

      <Form entity='Category' onSubmit={ onSubmit }>
        <Card className='my-4 mx-2' header={ header }>

          { exception && <Message text={ exception } severity='error'/> }

          <Input.Text id='name'
                      title='Category.label'
                      type='text'
                      value={ category.name }
                      required/>
          <Input.TextArea id='description'
                          title='Category.description'
                          value={ category.description }/>

          <div className='flex justify-end gap-2 mt-4'>
            <BackButton label='common.action.cancel' icon={ mdiCancel }/>
            <SubmitButton label='common.action.save' icon={ mdiContentSave }/>
          </div>
        </Card>
      </Form>
    </>
  )
}

export default CategoryForm
