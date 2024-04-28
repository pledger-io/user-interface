import React, { useEffect, useState } from "react";
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Dialog,
    Dropdown,
    Formats,
    Layout,
    Notifications,
    Pagination,
    Statistical,
    Translations,
    When
} from "../core";
import { NavLink } from "react-router-dom";
import { mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import { EntityShapes } from "../config";
import PropTypes from "prop-types";
import { useQueryParam } from "../core/hooks";
import AccountRepository from "../core/repositories/account-repository";

import '../assets/css/AccountOverview.scss'

const AccountRow = ({ account, deleteCallback }) => {

    const dropDownActions = {}
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => Notifications.Service.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.account.delete.failed'))

    return (
        <tr className='AccountRow' onMouseLeave={() => dropDownActions.close()}>
            <td>
                {account.iconFileCode && <Attachments.Image fileCode={account.iconFileCode}/>}
            </td>
            <td>
                <h2><NavLink to={`./${account.id}/transactions`}>{account.name}</NavLink></h2>
                <When condition={account.history.lastTransaction !== null}>
                    <div className='Summary'>
                        <label><Translations.Translation label='Account.lastActivity'/></label>
                        <Formats.Date date={account.history.lastTransaction}/>
                    </div>
                </When>
                <div className='Description Text Muted'>{account.description}</div>
            </td>
            <td className='hidden md:table-cell'>
                {account.account.iban && `${account.account.iban}`}
                {!account.account.iban && account.account.number && `${account.account.number}`}
            </td>
            <td><Statistical.Balance accounts={[account]} currency={account.account.currency}/></td>
            <td>
                <Dropdown.Dropdown icon={mdiDotsVertical} actions={dropDownActions}>
                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    icon={mdiSquareEditOutline}
                                    href={`./${account.id}/edit`}/>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={<Buttons.Button label='common.action.delete'
                                                                     variant='warning'
                                                                     icon={mdiTrashCanOutline}/>}
                                         onConfirm={onDelete}>
                        <Translations.Translation label='page.accounts.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            </td>
        </tr>
    )
}
AccountRow.propTypes = {
    account: EntityShapes.Account,
    deleteCallback: PropTypes.func
}

const AccountOverview = ({ type }) => {
    const [accounts, setAccounts]       = useState(undefined)
    const [page]                        = useQueryParam({ key: 'page', initialValue: "1" })
    const [pagination, setPagination]   = useState({})

    const reload = () => {
        setAccounts(undefined)
        AccountRepository.search({
            types: [type],
            page: parseInt(page)
        }).then(response => setAccounts(response.content) || setPagination(response.info))
    }

    useEffect(reload, [page, type])

    return (
        <div className='AccountOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label={`page.nav.accounts.${type}`}/>
            </BreadCrumbs>

            <Layout.Card title={`page.nav.accounts.${type}`} actions={
                [<Buttons.Button label={`page.account.${type}.add`}
                                 key='add'
                                 icon={mdiPlus}
                                 href='./add'
                                 variant='primary'/>]}>
                <Layout.Loading condition={accounts !== undefined}>
                    <table className='Table AccountTable'>
                        <thead>
                        <tr>
                            <th width='30'/>
                            <th><Translations.Translation label='Account.name'/></th>
                            <th width='160' className='hidden md:table-cell'><Translations.Translation label='Account.number'/></th>
                            <th width='120'><Translations.Translation label='common.account.saldo'/></th>
                            <th width='20'/>
                        </tr>
                        </thead>
                        <tbody>
                        {(accounts || []).map(account =>
                            <AccountRow key={account.id} account={account} deleteCallback={reload}/>)}
                        </tbody>
                    </table>

                    <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                                          pageSize={pagination.pageSize}/>
                </Layout.Loading>
            </Layout.Card>
        </div>
    )
}

export default AccountOverview
