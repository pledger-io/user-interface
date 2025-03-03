import { mdiDotsVertical, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React, { Attributes, useEffect, useState } from "react";
import { NavLink, useRouteLoaderData } from "react-router";
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import DateComponent from "../../../components/format/date.component";
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import { Dropdown } from "../../../components/layout/dropdown";
import Loading from "../../../components/layout/loading.component";
import { Paginator } from "../../../components/layout/paginator.component";
import ConfirmComponent from "../../../components/layout/popup/confirm.component";
import { PopupCallbacks } from "../../../components/layout/popup/popup.component";
import Translation from "../../../components/localization/translation.component";
import { Attachment, When } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";

import '../../../assets/css/AccountOverview.scss'
import { Account, Pagination } from "../../../types/types";
import useQueryParam from "../../../hooks/query-param.hook";
import NotificationService from "../../../service/notification.service";

type AccountRowProps = Attributes & {
    account: Account
    deleteCallback: () => void
}
const AccountRow = ({ account, deleteCallback }: AccountRowProps) => {

    const dropDownActions: PopupCallbacks = { close: () => null, open: () => null }
    const onDelete = () => AccountRepository.delete(account.id)
        .then(() => NotificationService.success('page.account.delete.success'))
        .then(() => deleteCallback())
        .catch(() => NotificationService.warning('page.account.delete.failed'))

    return (
        <tr className='' onMouseLeave={ () => dropDownActions.close() }>
            <td className='align-middle'>
                { account.iconFileCode && <Attachment.Image fileCode={ account.iconFileCode }/> }
            </td>
            <td>
                <h2 className='m-0 text-md md:text-lg'><NavLink to={ `./${ account.id }/transactions` }>{ account.name }</NavLink></h2>
                <When condition={ account.history.lastTransaction !== null }>
                    <div className='text-muted'>
                        <Translation label='Account.lastActivity' className='font-semibold'/>:
                        <DateComponent date={ account.history.lastTransaction }/>
                    </div>
                </When>
                <div className='hidden md:block mt-1 pl-1 text-muted text-sm'>{ account.description }</div>
            </td>
            <td className='hidden md:table-cell'>
                { account.account.iban && `${ account.account.iban }` }
                { !account.account.iban && account.account.number && `${ account.account.number }` }
            </td>
            <td><BalanceComponent accounts={ [account] } currency={ account.account.currency }/></td>
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

const AccountOverview = () => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [pagination, setPagination] = useState<Pagination>()
    const type = useRouteLoaderData('other-accounts')

    const reload = () => {
        setAccounts(undefined)
        AccountRepository.search({
            types: [type] as any,
            page: parseInt(page)
        }).then(response => {
            setAccounts(response.content)
            setPagination(response.info)
        })
    }

    useEffect(reload, [page, type])

    return (
        <div id='AccountPage'>
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
                    <table className='Table'>
                        <thead>
                        <tr>
                            <th className='md:w-[30px]'/>
                            <th><Translation label='Account.name'/></th>
                            <th className='hidden md:table-cell w-[160px]'><Translation label='Account.number'/></th>
                            <th className='md:w-[120px]'><Translation label='common.account.saldo'/></th>
                            <th className='w-[20px]'/>
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
