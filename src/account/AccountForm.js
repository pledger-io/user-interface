import React from "react";
import {PathParams, withNavigation} from "../core/hooks";

import {Form, Input, Entity, SubmitButton} from '../core/form'
import restAPI from "../core/RestAPI";
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Message,
    Notifications,
    Translations,
    When
} from "../core";
import {mdiCancel, mdiContentSave} from "@mdi/js";

import '../assets/css/AccountForm.scss'

class AccountService {
    load(id) {
        return new Promise((resolved, failed) => {
            restAPI.get(`accounts/${id}`)
                .then(account => resolved(new AccountModel(account)))
                .catch(e => failed(e))
        })
    }

    create(account) {
        return restAPI.put('accounts', account)
    }

    update(id, account) {
        return restAPI.post(`accounts/${id}`, account)
    }

    updateIcon(id, attachmentCode) {
        return restAPI.post(`accounts/${id}/image`, {
            fileCode: attachmentCode
        })
    }
}

const service = new AccountService()

class AccountModel {
    constructor(account) {
        this.name = account.name
        this.description = account.description
        this.currency = account.account.currency
        this.iban = account.account.iban
        this.bic = account.account.bic
        this.number = account.account.number
        this.type = account.type
    }
}

class AccountForm extends React.Component {
    static contextType = PathParams

    state = {
        id: NaN,
        account: null,
        exception: null
    }

    constructor(props, context) {
        super(props, context);

        this.context.resolved = params => {
            const {id, type} = params

            if (isNaN(id)) {
                this.setState({
                    ...this.state,
                    account: new AccountModel({
                        type: type,
                        account: {}
                    })
                })
            } else {
                service.load(id)
                    .then(account => this.setState({
                        id: id,
                        account: account
                    }))
                    .catch(exception => this.setState({
                        id: id,
                        exception: exception
                    }))
            }
        }
    }

    pictureSet(attachment) {
        const {id} = this.state

        service.updateIcon(id, attachment.fileCode)
            .then(() => Notifications.Service.success(''))
            .catch(() => Notifications.Service.warning('common.upload.file.failed'))
    }

    submit(entity) {
        const {id} = this.state
        const {navigate} = this.props

        if (isNaN(id)) {
            service.create(entity)
                .then(() => Notifications.Service.success('page.account.creation.success'))
                .then(() => navigate(-1))
                .catch(exception => {
                    this.setState({
                        ...this.state,
                        exception: exception
                    })
                    Notifications.Service.warning('page.account.creation.failed')
                })
        } else {
            service.update(id, entity)
                .then(() => Notifications.Service.success('page.account.update.success'))
                .then(() => navigate(-1))
                .catch(exception => {
                    this.setState({
                        ...this.state,
                        exception: exception
                    })
                    Notifications.Service.warning('page.account.update.failed')
                })
        }
    }

    render() {
        const {id, account, exception} = this.state
        const {type} = this.props

        if (!account) {
            return '';
        }

        const overviewHref = isNaN(id) ? './../' : './../../'
        const addEditBreadcrumb = isNaN(id) ? 'page.title.accounts.add' : 'page.title.accounts.edit'

        return (
            <div className='AccountForm'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.accounts'/>
                    <BreadCrumbItem label={`page.nav.accounts.${type}`} href={overviewHref}/>
                    <BreadCrumbItem label={addEditBreadcrumb}/>
                </BreadCrumbs>

                <Form entity='Account' onSubmit={this.submit.bind(this)}>
                    <Card title={addEditBreadcrumb}
                          buttons={[
                              <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                              <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                        <When condition={type === 'creditor' || type === 'debtor'}>
                            <Input.Hidden id='type' value={type} />
                        </When>
                        <When condition={exception}>
                            <Message message={exception} variant={'warning'}/>
                        </When>
                        <fieldset className='General'>
                            <div>
                                <legend><Translations.Translation label='page.account.accounts.general'/></legend>

                                <Input.Text id='name'
                                             value={account.name}
                                             title='Account.name'
                                             help='Account.name.help'
                                             type='text'
                                             required/>

                                <Entity.Currency id='currency'
                                                value={account.currency}
                                                title='Account.currency'
                                                required/>

                                <When condition={type !== 'creditor' && type !== 'debtor'}>
                                    <Entity.AccountType id='type'
                                                       value={account.type}
                                                       title='Account.type'
                                                       required/>
                                </When>
                            </div>
                            <Attachments.Upload label='page.accounts.accounts.changeIcon'
                                                accepts='image/*'
                                                onUpload={this.pictureSet.bind(this)}/>
                        </fieldset>

                        <fieldset>
                            <legend><Translations.Translation label='page.account.accounts.accountdetails'/></legend>

                            <Input.Text id='iban'
                                         value={account.iban}
                                         title='Account.iban'
                                         pattern='^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$'
                                         type='text'
                                         help='Account.iban.help'/>

                            <Input.Text id='bic'
                                         value={account.bic}
                                         title='Account.bic'
                                         type='text'
                                         help='Account.bic.help'/>

                            <Input.Text id='number'
                                         value={account.number}
                                         title='Account.number'
                                         type='text'/>

                            <Input.TextArea id='description'
                                        value={account.description}
                                        title='Account.description'/>
                        </fieldset>
                    </Card>
                </Form>
            </div>
        )
    }
}

const formWithNavigate = withNavigation(AccountForm)
export {
    formWithNavigate as AccountForm
}
