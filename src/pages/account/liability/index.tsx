import { mdiPlus } from "@mdi/js";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import AccountMenu from "../../../components/account/account-menu.component";
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import DateComponent from "../../../components/format/date.component";
import PercentageComponent from "../../../components/format/percentage.component";
import { Button } from "../../../components/layout/button";
import { i10n } from "../../../config/prime-locale";
import { Attachment } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";
import useQueryParam from "../../../hooks/query-param.hook";
import { Account, Pagination } from "../../../types/types";

const accountNameColumn = (account: Account) => <>
  <NavLink className='text-blue-700' to={ `./${ account.id }` }>{ account.name }</NavLink>
  <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
    <span className='font-semibold'>
        { i10n('Account.lastActivity') }:
    </span>
    <DateComponent date={ account.history.lastTransaction }/>
  </div>
  <span className='hidden md:block mt-1 pl-1 text-muted text-sm'>{ account.description }</span>
</>

const percentageColumn = (account: Account) => <>
  <PercentageComponent percentage={ account.interest.interest } decimals={ 2 }/>
  ({ i10n(`Periodicity.${ account.interest?.periodicity }`) })
</>

const LiabilityOverview = () => {
  const navigate = useNavigate()
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
  const [pagination, setPagination] = useState<Pagination>()

  const reload = () => {
    setAccounts(undefined)
    AccountRepository.search({
      types: ['loan', 'mortgage', 'debt'] as any,
      page: parseInt(page)
    }).then(resultPage => {
      setAccounts(resultPage.content || [])
      setPagination(resultPage.info)
    })
  }

  useEffect(reload, [page])

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.nav.accounts.liability') }
  </div>
  return (
    <>
      <BreadCrumbs>
        <BreadCrumbItem label='page.nav.settings'/>
        <BreadCrumbItem label='page.nav.accounts'/>
        <BreadCrumbItem label='page.nav.accounts.liability'/>
      </BreadCrumbs>

      <ConfirmDialog className='max-w-[25rem]'/>

      <Card header={ header } className='my-4 mx-2'>
        <div className='flex justify-end mb-4'>
          <Button label={ `page.title.accounts.liabilities.add` }
                  severity='success'
                  size='small'
                  onClick={ () => navigate('/accounts/liability/add') }
                  icon={ mdiPlus } />
        </div>

        <DataTable value={ accounts } size='small' loading={ !accounts }>
          <Column className='w-[3rem]' body={ account => <>
            { account.iconFileCode && <Attachment.Image fileCode={ account.iconFileCode }/> }
          </> }/>
          <Column header={ i10n('Account.name') } body={ accountNameColumn }/>
          <Column className='w-[9rem]'
                  body={ percentageColumn }
                  header={ i10n('Account.interest') + ' (' + i10n('Account.interestPeriodicity') + ')' }/>
          <Column header={ i10n('common.account.saldo') }
                  className='w-[9rem]'
                  body={ (account: Account) =>
                    <BalanceComponent accounts={ [account] } currency={ account.account.currency }/> }/>
          <Column className='w-[1rem]' body={ account => <AccountMenu account={ account } callback={ reload }/> }/>
        </DataTable>

        { (pagination?.records || 0) > 0
          && <Paginator totalRecords={ pagination?.records }
                        rows={ pagination?.pageSize }
                        onPageChange={ ({ page }) => navigate('?page=' + page) }/> }

      </Card>
    </>
  )
}

export default LiabilityOverview
