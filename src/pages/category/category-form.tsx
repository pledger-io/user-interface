import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mdiCancel, mdiContentSave } from "@mdi/js";

import CategoryRepository from "../../core/repositories/category-repository";
import { Form, Input, SubmitButton } from '../../core/form'
import { BreadCrumbItem, BreadCrumbs, Buttons, Message, Notifications } from "../../core";
import { Category } from "../../core/types";

import Card from "../../components/layout/card.component";

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
                .then(() => Notifications.Service.success('page.category.create.success'))
                .then(() => navigate(-1))
                .catch(e => {
                    setException(e)
                    Notifications.Service.warning('page.category.create.failed')
                })
        else
            CategoryRepository.create(entity)
                .then(() => Notifications.Service.success('page.category.update.success'))
                .then(() => navigate(-1))
                .catch(e => {
                    setException(e)
                    Notifications.Service.warning('page.category.update.failed')
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
                          <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
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