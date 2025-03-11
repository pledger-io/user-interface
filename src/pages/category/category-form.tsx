import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { Form, Input, SubmitButton } from "../../components/form";
import NotificationService from "../../service/notification.service";

import CategoryRepository from "../../core/repositories/category-repository";
import { Category } from "../../types/types";

import { BackButton } from "../../components/layout/button";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { i10n } from "../../config/prime-locale";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

const CategoryForm = () => {
    const [category, setCategory] = useState<Category>({ } as Category)
    const [exception, setException] = useState()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) CategoryRepository.get(id).then(setCategory)
    }, [id])

    const onSubmit = (entity: any) => {
        if (id)
            CategoryRepository.update(id, entity)
                .then(() => NotificationService.success('page.category.create.success'))
                .then(() => navigate(-1))
                .catch(e => {
                    setException(e)
                    NotificationService.warning('page.category.create.failed')
                })
        else
            CategoryRepository.create(entity)
                .then(() => NotificationService.success('page.category.update.success'))
                .then(() => navigate(-1))
                .catch(e => {
                    setException(e)
                    NotificationService.warning('page.category.update.failed')
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
                                value={ category.label }
                                required/>
                    <Input.TextArea id='description'
                                    title='Category.description'
                                    value={ category.description }/>

                    <div className='flex justify-end gap-2 mt-2'>
                        <SubmitButton label='common.action.save' icon={ mdiContentSave } />
                        <BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>
                    </div>
                </Card>
            </Form>
        </>
    )
}

export default CategoryForm