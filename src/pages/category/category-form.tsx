import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import { SubmitButton, Form, Input } from "../../components/form";
import NotificationService from "../../service/notification.service";

import CategoryRepository from "../../core/repositories/category-repository";
import Message from "../../components/layout/message.component";
import { Category } from "../../types/types";

import Card from "../../components/layout/card.component";
import { BackButton } from "../../components/layout/button";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";

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

    return (
        <div className='CategoryForm'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.settings.categories'/>
            </BreadCrumbs>

            <Form entity='Category' onSubmit={onSubmit}>
                <Card title='page.settings.categories.add'
                      buttons={[
                          <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                          <BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                    {exception && <Message message={exception} variant='warning'/>}
                    <Message label='page.settings.category.help' variant='info'/>
                    <Input.Text id='name'
                                title='Category.label'
                                type='text'
                                value={category.label}
                                required/>
                    <Input.TextArea id='description'
                                    title='Category.description'
                                    value={category.description}/>
                </Card>
            </Form>
        </div>
    )
}

export default CategoryForm