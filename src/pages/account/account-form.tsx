import '../../assets/css/AccountForm.scss'
import { mdiCancel, mdiContentSave } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Entity, Form, Input, SubmitButton } from "../../components/form";
import { BackButton } from "../../components/layout/button";
import Translation from "../../components/localization/translation.component";
import { Attachment } from "../../core";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../types/types";
import NotificationService from "../../service/notification.service";
import { Card } from "primereact/card";
import { i10n } from "../../config/prime-locale";
import { Message } from "primereact/message";

class AccountModel {
    name: string
    description: string
    currency: string
    iban: string
    bic: string
    number: string
    type: string

    constructor(account: Account) {
        this.name = account.name
        this.description = account.description
        this.currency = account.account.currency
        this.iban = account.account.iban
        this.bic = account.account.bic
        this.number = account.account.number
        this.type = account.type
    }
}

const AccountForm = ({ type }: { type: string }) => {
    const { id } = useParams()
    const [account, setAccount] = useState<AccountModel>(() => new AccountModel({
        type: type !== 'accounts' ? type : undefined,
        account: {}
    } as Account))
    const [exception, setException] = useState(null)
    const navigate = useNavigate();

    const overviewHref = isNaN(parseInt(id as string)) ? './../' : './../../'
    const addEditBreadcrumb = isNaN(parseInt(id as string)) ? 'page.title.accounts.add' : 'page.title.accounts.edit'

    const onSubmit = (entity: any) => {
        if (isNaN(parseInt(id as string))) {
            AccountRepository.create(entity)
                .then(() => NotificationService.success('page.account.creation.success'))
                .then(() => navigate(-1))
                .catch(exception => {
                    setException(exception)
                    NotificationService.warning('page.account.creation.failed')
                })
        } else {
            AccountRepository.update(id, entity)
                .then(() => NotificationService.success('page.account.update.success'))
                .then(() => navigate(-1))
                .catch(exception => {
                    setException(exception)
                    NotificationService.warning('page.account.update.failed')
                })
        }
    }
    const onPictureChange = (attachment: any) => AccountRepository.icon(id, attachment.fileCode)
        .then(() => NotificationService.success(''))
        .catch(() => NotificationService.warning('common.upload.file.failed'))

    useEffect(() => {
        if (!isNaN(parseInt(id as string)))
            AccountRepository.get(id)
                .then(a => new AccountModel(a))
                .then(setAccount)
                .catch(setException)
    }, [id])

    const header = () =>  <div className='px-2 py-2 border-b-1 text-center font-bold'>
        { i10n(addEditBreadcrumb) }
    </div>

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label={ `page.nav.accounts.${ type }` } href={ overviewHref }/>
            <BreadCrumbItem label={ addEditBreadcrumb }/>
        </BreadCrumbs>

        <Card className='my-4 mx-2' header={ header }>
            <Form entity='Account' onSubmit={ onSubmit }>
                { (type === 'creditor' || type === 'debtor') && (<Input.Hidden id='type' value={ type }/>) }
                { exception && <Message text={ exception } severity='error' /> }

                <fieldset className='General'>
                    <div>
                        <legend><Translation label='page.account.accounts.general'/></legend>

                        <Input.Text id='name'
                                    value={ account.name }
                                    title='Account.name'
                                    help='Account.name.help'
                                    type='text'
                                    required/>

                        <Entity.Currency id='currency'
                                         value={ account.currency }
                                         title='Account.currency'
                                         required/>

                        { type !== 'creditor' && type !== 'debtor' && (
                            <Entity.AccountType id='type'
                                                value={ account.type }
                                                title='Account.type'
                                                required/>) }
                    </div>
                    <Attachment.Upload label='page.accounts.accounts.changeIcon'
                                       accepts='image/*'
                                       onUpload={ onPictureChange }/>
                </fieldset>

                <fieldset>
                    <legend><Translation label='page.account.accounts.accountdetails'/></legend>

                    <Input.Text id='iban'
                                value={ account.iban }
                                title='Account.iban'
                                pattern='^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$'
                                type='text'
                                help='Account.iban.help'/>

                    <Input.Text id='bic'
                                value={ account.bic }
                                title='Account.bic'
                                type='text'
                                help='Account.bic.help'/>

                    <Input.Text id='number'
                                value={ account.number }
                                title='Account.number'
                                type='text'/>

                    <Input.TextArea id='description'
                                    value={ account.description }
                                    title='Account.description'/>
                </fieldset>

                <div className='flex justify-end gap-2 mt-2'>
                    <SubmitButton label='common.action.save' icon={ mdiContentSave } />
                    <BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>
                </div>
            </Form>
        </Card>
    </>
}

export default AccountForm