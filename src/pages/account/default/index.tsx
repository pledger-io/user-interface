import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useRouteLoaderData } from "react-router";
import AccountMenu from "../../../components/account/account-menu.component";
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import DateComponent from "../../../components/format/date.component";
import { i10n } from "../../../config/prime-locale";
import { Attachment } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";
import useQueryParam from "../../../hooks/query-param.hook";
import { ROUTER_ACCOUNT_TYPE_KEY } from "../../../types/router-types";
import { Account, Pagination } from "../../../types/types";

const accountNameColumn = (account: Account) => <>
  <NavLink className='text-blue-700' to={ `./${ account.id }/transactions` }>{ account.name }</NavLink>
  <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
                            <span className='font-semibold'>
                                { i10n('Account.lastActivity') }:
                            </span>
    <DateComponent date={ account.history.lastTransaction }/>
  </div>
  <span className='hidden md:block mt-1 pl-1 text-muted text-sm'>
                            { account.description }
                        </span>
</>

const AccountOverview = () => {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [pagination, setPagination] = useState<Pagination>()
  const type = useRouteLoaderData(ROUTER_ACCOUNT_TYPE_KEY)

  const reload = () => {
    setAccounts(undefined)
    AccountRepository.search({
      types: [type] as any,
      page: parseInt(page)
    }).then(response => {
      setAccounts(response.content || [])
      setPagination(response.info)
    })
  }

  useEffect(reload, [page, type])

  const pageChanged = (event: PaginatorPageChangeEvent) => {
    navigate('?page=' + (event.page + 1))
  }
  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n(`page.nav.accounts.${ type }`) }
  </div>

  return (
    <div id='AccountPage'>
      <BreadCrumbs>
        <BreadCrumbItem label='page.nav.settings'/>
        <BreadCrumbItem label='page.nav.accounts'/>
        <BreadCrumbItem label={ `page.nav.accounts.${ type }` }/>
      </BreadCrumbs>

      <ConfirmDialog className='max-w-[25rem]'/>

      <Card header={ header } className='my-4 mx-2'>
        <div className='flex justify-end'>
          <NavLink to={ './add' }
                   className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
            <Icon path={ mdiPlus } size={ .8 }/> { i10n(`page.account.${ type }.add`) }
          </NavLink>
        </div>

        <DataTable loading={ !accounts } value={ accounts } size='small'>
          <Column className='w-[3rem]' body={ account => <>
            { account.iconFileCode && <Attachment.Image fileCode={ account.iconFileCode }/> }
          </> }/>
          <Column header={ i10n('Account.name') } body={ accountNameColumn }/>
          <Column header={ i10n('Account.number') }
                  body={ account => account.account.iban || account.account.number }/>
          <Column header={ i10n('common.account.saldo') }
                  className='w-[9rem]'
                  body={ (account: Account) =>
                    <BalanceComponent accounts={ [account] } currency={ account.account.currency }/> }/>

          <Column className='w-[1rem]' body={ account => <AccountMenu account={ account } callback={ reload }/> }/>
        </DataTable>

        { (pagination?.records || 0) > 0
          && <Paginator totalRecords={ pagination?.records }
                        rows={ pagination?.pageSize }
                        onPageChange={ pageChanged }/> }
      </Card>
    </div>
  )
}

export default AccountOverview
