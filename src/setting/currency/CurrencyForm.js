import React, {useEffect, useState} from "react";
import {mdiCancel, mdiContentSave} from "@mdi/js";

import {Form, Input, SubmitButton} from "../../core/form";
import {BreadCrumbItem, BreadCrumbs, Buttons, Layout} from "../../core";
import {useParams} from "react-router-dom";
import {CurrencyRepository} from "../../core/RestAPI";

export const CurrencyForm = () => {
    const [currency, setCurrency] = useState({})
    const {code}                  = useParams()

    useEffect(() => {
        CurrencyRepository.get(code)
            .then(setCurrency)
    }, [code])

    const onSubmit = () => undefined

    const overviewUri = code == null ? './..' : './../..'
    const pageBreadCrumb = code == null ? 'page.settings.currencies.add' : 'page.settings.currencies.edit'
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings.options'/>
            <BreadCrumbItem label='page.settings.currencies.title' href={overviewUri}/>
            <BreadCrumbItem label={pageBreadCrumb}/>
        </BreadCrumbs>

        <Form onSubmit={onSubmit} entity='Currency'>
            <Layout.Card title={pageBreadCrumb}
                  buttons={[
                      <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                      <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                <Input.Text title='Currency.name'
                            id='name'
                            value={currency.name}
                            required/>

                <Input.Text title='Currency.code'
                            id='code'
                            value={currency.code}
                            required/>

                <Input.Text title='Currency.symbol'
                            id='symbol'
                            value={currency.symbol}
                            minLength={1}
                            maxLength={1}
                            required/>
            </Layout.Card>
        </Form>
    </>
}

