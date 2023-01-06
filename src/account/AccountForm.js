import React, {useEffect, useState} from "react";

import {Entity, Form, Input, SubmitButton} from '../core/form'
import {AccountRepository} from "../core/RestAPI";
import {Attachments, BreadCrumbItem, BreadCrumbs, Buttons, Card, Message, Notifications, Translations} from "../core";
import {mdiCancel, mdiContentSave} from "@mdi/js";

import '../assets/css/AccountForm.scss'
import {useNavigate, useParams} from "react-router-dom";

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

const AccountForm = ({type}) => {
    const {id}                      = useParams()
    const [account, setAccount]     = useState(new AccountModel({type: type, account: {}}))
    const [exception, setException] = useState(null)
    const navigate                  = useNavigate();

    const overviewHref      = isNaN(id) ? './../' : './../../'
    const addEditBreadcrumb = isNaN(id) ? 'page.title.accounts.add' : 'page.title.accounts.edit'

    const onSubmit = entity => {
        if (isNaN(id)) {
            AccountRepository.create(entity)
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
            AccountRepository.update(id, entity)
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
    const onPictureChange = attachment => AccountRepository.icon(id, attachment.fileCode)
        .then(() => Notifications.Service.success(''))
        .catch(() => Notifications.Service.warning('common.upload.file.failed'))

    useEffect(() => {
        if (!isNaN(id))
            AccountRepository.get(id)
                .then(a => new AccountModel(a))
                .then(setAccount)
                .catch(setException)
    }, [id])

    return (
        <div className='AccountForm'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label={`page.nav.accounts.${type}`} href={overviewHref}/>
                <BreadCrumbItem label={addEditBreadcrumb}/>
            </BreadCrumbs>

            <Form entity='Account' onSubmit={onSubmit}>
                <Card title={addEditBreadcrumb}
                      buttons={[
                          <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                          <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                    { (type === 'creditor' || type === 'debtor') && (<Input.Hidden id='type' value={type} />) }
                    {exception && <Message message={exception} variant={'warning'}/>}
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

                            {type !== 'creditor' && type !== 'debtor' && (
                                <Entity.AccountType id='type'
                                                    value={account.type}
                                                    title='Account.type'
                                                    required/>)}
                        </div>
                        <Attachments.Upload label='page.accounts.accounts.changeIcon'
                                            accepts='image/*'
                                            onUpload={onPictureChange}/>
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

export default AccountForm
