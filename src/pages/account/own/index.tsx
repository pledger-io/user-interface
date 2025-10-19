import { mdiPlus } from "@mdi/js";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import OwnAccountMenu from "../../../components/account/own-account-menu";
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Amount } from "../../../components/form/input";
import DateComponent from "../../../components/format/date.component";
import MoneyComponent from "../../../components/format/money.component";
import { Button } from "../../../components/layout/button";
import { i10n } from "../../../config/prime-locale";
import AccountRepository from "../../../core/repositories/account-repository";
import DateRangeService from "../../../service/date-range.service";
import { Account } from "../../../types/types";

const OwnAccountsView = () => {
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
  const navigate = useNavigate()

  const loadAccounts = () => {
    setAccounts(undefined)
    AccountRepository.own().then(setAccounts)
  }

  useEffect(loadAccounts, [])

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.nav.accounts.accounts') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.accounts'/>
      <BreadCrumbItem label='page.nav.accounts.accounts'/>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <Card className='my-4 mx-2' header={ header }>
      <div className='flex justify-end mb-4'>
        <Button label={ `page.account.accounts.add` }
                severity='success'
                size='small'
                onClick={ () => navigate('/accounts/own/add') }
                icon={ mdiPlus } />
      </div>

      <DataTable loading={ !accounts } value={ accounts } size='small'>
        <Column header={ i10n('Account.name') } body={ account => <>
          <NavLink className='text-blue-700'
                   to={ `/accounts/${ ['savings', 'joined_savings'].indexOf(account.type) == -1 ? 'own' : 'savings' }/${ account.id }/transactions` }>{ account.name }</NavLink>
          <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
            <label className='font-bold mr-1'>{ i10n('Account.type') }:</label>
            { i10n(`AccountType.${ account.type }`) }
          </div>
          { account.history && <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
            <label className='font-bold mr-1'>{ i10n('Account.lastActivity') }:</label>
            <DateComponent className='md:px-0 px-2' date={ account.history?.lastTransaction }/>
          </div> }
        </> }/>
        <Column header={ i10n('Account.number') }
                body={ account => account.account.iban || account.account.number }/>
        <Column header={ i10n('common.account.saldo') }
                className='w-[9rem]'
                body={ (account: Account) => determineBalance(account) }/>
        <Column className='w-[1rem]'
                body={ account => <OwnAccountMenu account={ account } callback={ loadAccounts }/> }/>
      </DataTable>
    </Card>
  </>
}

function determineBalance(account: Account) {
  if (!account.history) {
    return <MoneyComponent money={ 0 } currency={ account.account.currency } />
  }

  return <BalanceComponent accounts={ [account.id] }
                           range={ DateRangeService.forRange(account.history.firstTransaction, account.history.lastTransaction) }
                           currency={ account.account.currency }/>
}

export default OwnAccountsView
