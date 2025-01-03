import React, { useEffect, useState } from "react";
import { mdiCancel, mdiContentSave } from "@mdi/js";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { BackButton } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import { Currency } from "../../../types/types";

import { Form, Input, SubmitButton } from "../../../components/form";
import { useNavigate, useParams } from "react-router";
import { CurrencyRepository } from "../../../core/RestAPI";

const _ = () => {
    const [currency, setCurrency] = useState<Currency>({} as Currency)
    const { code } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        CurrencyRepository.get(code)
            .then(setCurrency)
    }, [code])

    const onSubmit = (entity: any) => {
        if (code) {
            CurrencyRepository.update(code, entity)
                .then(() => navigate(-1))
        } else {
            CurrencyRepository.create(entity)
                .then(() => navigate(-1))
        }
    }

    const overviewUri = code == null ? './..' : './../..'
    const pageBreadCrumb = code == null ? 'page.settings.currencies.add' : 'page.settings.currencies.edit'
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
            <BreadCrumbItem label='page.settings.currencies.title' href={ overviewUri }/>
            <BreadCrumbItem label={ pageBreadCrumb }/>
        </BreadCrumbs>

        <Form onSubmit={ onSubmit } entity='Currency'>
            <Card title={ pageBreadCrumb }
                         buttons={ [
                             <SubmitButton key='save' label='common.action.save' icon={ mdiContentSave }/>,
                             <BackButton key='cancel' label='common.action.cancel' icon={ mdiCancel }/>] }>
                <Input.Text title='Currency.name'
                            type='text'
                            id='name'
                            value={ currency.name }
                            required/>

                <Input.Text title='Currency.code'
                            type='text'
                            id='code'
                            value={ currency.code }
                            required/>

                <Input.Text title='Currency.symbol'
                            type='text'
                            id='symbol'
                            value={ currency.symbol }
                            minLength={ 1 }
                            maxLength={ 1 }
                            required/>
            </Card>
        </Form>
    </>
}

export default _