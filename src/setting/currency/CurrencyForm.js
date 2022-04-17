import React from "react";
import {PathParams, withPathParams} from "../../core/hooks";
import {mdiCancel, mdiContentSave} from "@mdi/js";

import {Form, Input, SubmitButton} from "../../core/form";
import {BreadCrumbItem, BreadCrumbs, Buttons, Card} from "../../core";
import restAPI from "../../core/RestAPI";

class CurrencyService {
    load(code) {
        return restAPI.get(`settings/currencies/${code}`)
    }
}
const service = new CurrencyService()

class CurrencyForm extends React.Component {
    static contextType = PathParams

    state = {
        code: null,
        currency: {}
    }

    constructor(props, context) {
        super(props, context);

        this.context.resolved = ({code}) => {
            if (code != null) {
                service.load(code)
                    .then(currency =>
                        this.setState({
                            code: code,
                            currency: currency
                        }))
                    .catch(exception => this.setState({
                        code: code,
                        exception: exception
                    }))
            }
        }
    }

    submit(entity) {

    }

    render() {
        const {code, currency} = this.state

        const overviewUri = code == null ? './..' : './../..'
        const pageBreadCrumb = code == null ? 'page.settings.currencies.add' : 'page.settings.currencies.edit'
        return <>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings.options'/>
                <BreadCrumbItem label='page.settings.currencies.title' href={overviewUri}/>
                <BreadCrumbItem label={pageBreadCrumb}/>
            </BreadCrumbs>

            <Form onSubmit={this.submit.bind(this)} entity='Currency'>
                <Card title={pageBreadCrumb}
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
                </Card>
            </Form>
        </>
    }
}

const currencyFormWithParams = withPathParams(CurrencyForm)

export {
    currencyFormWithParams as CurrencyForm
}
