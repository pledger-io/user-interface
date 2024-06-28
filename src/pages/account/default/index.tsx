import { mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { NavLink, useLoaderData } from "react-router-dom";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import { Dropdown } from "../../../components/layout/dropdown";
import Loading from "../../../components/layout/loading.component";
import { Paginator } from "../../../components/layout/paginator.component";
import ConfirmComponent from "../../../components/layout/popup/confirm.component";
import { PopupCallbacks } from "../../../components/layout/popup/popup.component";
import Translation from "../../../components/localization/translation.component";
import { EntityShapes } from "../../../config";
import { Attachment, Statistical, When } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";

import '../../../assets/css/AccountOverview.scss'
import { Pagination } from "../../../core/types";
import useQueryParam from "../../../hooks/query-param.hook";
import NotificationService from "../../../service/notification.service";

const AccountRow = ({ account, deleteCallback }) => {

    const dropDownActions: PopupCallbacks = { close: () => null, open: () => null }
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => NotificationService.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => NotificationService.warning('page.account.delete.failed'))

    return (
        <tr className='AccountRow' onMouseLeave={ () => dropDownActions.close() }>
            <td>
                { account.iconFileCode && <Attachment.Image fileCode={ account.iconFileCode }/> }
            </td>
            <td>
                <h2><NavLink to={ `./${ account.id }/transactions` }>{ account.name }</NavLink></h2>
                <When condition={ account.history.lastTransaction !== null }>
                    <div className='Summary'>
                        <label><Translation label='Account.lastActivity'/></label>
                        <Date date={ account.history.lastTransaction }/>
                    </div>
                </When>
                <div className='Description Text Muted'>{ account.description }</div>
            </td>
            <td className='hidden md:table-cell'>
                { account.account.iban && `${ account.account.iban }` }
                { !account.account.iban && account.account.number && `${ account.account.number }` }
            </td>
            <td><Statistical.Balance accounts={ [account] } currency={ account.account.currency }/></td>
            <td>
                <Dropdown icon={ mdiDotsVertical } actions={ dropDownActions }>
                    <Button label='common.action.edit'
                            variant='primary'
                            icon={ mdiSquareEditOutline }
                            href={ `./${ account.id }/edit` }/>
                    <ConfirmComponent title='common.action.delete'
                                      openButton={ <Button label='common.action.delete'
                                                           variant='warning'
                                                           icon={ mdiTrashCanOutline }/> }
                                      onConfirm={ onDelete }>
                        <Translation label='page.accounts.delete.confirm'/>
                    </ConfirmComponent>
                </Dropdown>
            </td>
        </tr>
    )
}
AccountRow.propTypes = {
    account: EntityShapes.Account,
    deleteCallback: PropTypes.func.isRequired
}

const AccountOverview = () => {
    const [accounts, setAccounts] = useState(undefined)
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [pagination, setPagination] = useState<Pagination>()
    const type = useLoaderData()

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
                <BreadCrumbItem label={ `page.nav.accounts.${ type }` }/>
            </BreadCrumbs>

            <Card title={ `page.nav.accounts.${ type }` } actions={
                [<Button label={ `page.account.${ type }.add` }
                         key='add'
                         icon={ mdiPlus }
                         href='./add'
                         variant='primary'/>] }>
                <Loading condition={ accounts !== undefined }>
                    <table className='Table AccountTable'>
                        <thead>
                        <tr>
                            <th width='30'/>
                            <th><Translation label='Account.name'/></th>
                            <th width='160' className='hidden md:table-cell'><Translation label='Account.number'/></th>
                            <th width='120'><Translation label='common.account.saldo'/></th>
                            <th width='20'/>
                        </tr>
                        </thead>
                        <tbody>
                        { (accounts || []).map(account =>
                            <AccountRow key={ account.id } account={ account } deleteCallback={ reload }/>) }
                        </tbody>
                    </table>

                    <Paginator page={ parseInt(page) }
                               records={ pagination?.records }
                               pageSize={ pagination?.pageSize }/>
                </Loading>
            </Card>
        </div>
    )
}

export default AccountOverview
