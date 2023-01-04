import React, {useEffect, useState} from "react";
import {
    Attachments,
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Dropdown,
    Formats,
    Notifications,
    Pagination,
    Statistical,
    Translations,
    When
} from "../core";
import {AccountRepository} from "../core/RestAPI";
import {NavLink, useNavigate} from "react-router-dom";
import {mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";

import '../assets/css/AccountOverview.scss'
import {EntityShapes} from "../config";
import PropTypes from "prop-types";
import {useQueryParam} from "../core/hooks";

const AccountRow = ({account, deleteCallback}) => {

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
                <NavLink to={`./${account.id}/transactions`}>{account.name}</NavLink>
                <When condition={account.history.lastTransaction !== null}>
                    <div className='Text Muted'>
                        <Translations.Translation label='Account.lastActivity'/>
                        <Formats.Date date={account.history.lastTransaction}/>
                    </div>
                </When>
                <div className='Text Muted'>{account.description}</div>
            </td>
            <td>
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

const AccountOverview = ({type}) => {
    const [accounts, setAccounts]       = useState([])
    const [page]                        = useQueryParam('page', "1")
    const [pagination, setPagination]   = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        AccountRepository.search({
            types: [type],
            page: parseInt(page)
        }).then(response => setAccounts(response.content) || setPagination(response.info))
    }, [page, type])

    return (
        <div className='AccountOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label={`page.nav.accounts.${type}`}/>
            </BreadCrumbs>

            <Card title={`page.nav.accounts.${type}`} actions={
                [<Buttons.Button label={`page.account.${type}.add`}
                                 key='add'
                                 icon={mdiPlus}
                                 href='./add'
                                 variant='primary'/>]}>
                <table className='Table AccountTable'>
                    <thead>
                    <tr>
                        <th width='30'/>
                        <th><Translations.Translation label='Account.name'/></th>
                        <th width='150'><Translations.Translation label='Account.number'/></th>
                        <th width='110'><Translations.Translation label='common.account.saldo'/></th>
                        <th width='20'/>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map(account =>
                        <AccountRow key={account.id} account={account} deleteCallback={() => navigate('.')}/>)}
                    </tbody>
                </table>

                <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                                      pageSize={pagination.pageSize}/>
            </Card>
        </div>
    )
}

export default AccountOverview
