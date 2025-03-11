import { mdiCashPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Panel } from "primereact/panel";
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from "react-router";
import LiabilityGraph from "../../../components/account/liability-graph.component";
import LiabilityTransactionList from "../../../components/account/liability-transaction-list.component";
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import MoneyComponent from "../../../components/format/money.component";
import PercentageComponent from "../../../components/format/percentage.component";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";
import Translation from "../../../components/localization/translation.component";
import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";
import DateRangeService from "../../../service/date-range.service";
import DateRange from "../../../types/date-range.type";
import { Account, Transaction } from "../../../types/types";

const LiabilityDetailView = () => {
  const [account, setAccount] = useState<Account>()
  const [openingTransaction, setOpeningTransaction] = useState<Transaction>()
  const [range, setRange] = useState<DateRange>()
  const { id } = useParams()

  useEffect(() => {
    AccountRepository.get(id).then(setAccount)
    AccountRepository.firstTransaction(id, 'Opening balance')
      .then(setOpeningTransaction)
  }, [id])

  useEffect(() => {
    if (account)
      setRange(DateRangeService.forRange(
        account.history.firstTransaction,
        account.history.lastTransaction))
  }, [account])

  if (!account || !range) return <Loading/>
  return (
    <div>
      <BreadCrumbs>
        <BreadCrumbItem label='page.nav.settings'/>
        <BreadCrumbItem label='page.nav.accounts'/>
        <BreadCrumbItem label='page.nav.accounts.liability' href='/accounts/liability'/>
        <BreadCrumbItem message={ account.name }/>
        <BreadCrumbItem label='page.nav.transactions'/>
      </BreadCrumbs>

      <div className="flex gap-2 flex-wrap mx-2">
        <Card className='flex-1'>
          <h1 className='font-bold'>{ account.name }</h1>
          <div className="flex">
            <label className='min-w-[8em]'>{ i10n('Account.interest') }:</label>
            <span className='flex-1'><PercentageComponent percentage={ account.interest?.interest }/></span>
          </div>
          <div className="flex">
            <label className='min-w-[8em]'>{ i10n('Account.interestPeriodicity') }:</label>
            <span className='flex-1'><Translation
              label={ `Periodicity.${ account.interest?.periodicity }` }/></span>
          </div>
          <div className="flex">
            <label className='min-w-[8em]'>{ i10n('page.accounts.liability.startBalance') }:</label>
            <span className='flex-1 *:text-warning!'>
              <MoneyComponent money={ openingTransaction?.amount } currency={ account.account.currency }/>
            </span>
          </div>
          <div className="flex">
            <label className='min-w-[8em]'>{ i10n('page.accounts.liability.paid') }:</label>
            <span className='flex-1'>
                <BalanceComponent accounts={ [{ id: account.id }] }
                                  income={ true }
                                  currency={ account.account.currency }/>
            </span>
          </div>
        </Card>
        <Card className='flex-2'>
          <h1 className='font-bold'>{ i10n('common.account.balance') }</h1>
          <h4 className='flex gap-1'>
            <span>{ i10n(`common.month.${ range.month() }`) }</span>
            <span>{ range.year() }</span>
            -
            <span>{ i10n(`common.month.${ range.endMonth() }`) }</span>
            { range.endYear() }
          </h4>

          <LiabilityGraph account={ account } range={ range }/>
        </Card>
      </div>

      <Panel header={ i10n('page.title.transactions.overview') } className='px-2'>
        <div className='flex justify-end mb-2'>
          <NavLink to={ `${ Resolver.Account.resolveUrl(account) }/transactions/add` }
                   className='p-button p-button-success gap-1'>
            <Icon path={ mdiCashPlus } size={ 1 } />
            { i10n('page.account.liability.payment.add') }
          </NavLink>
        </div>

        <LiabilityTransactionList account={ account } range={ range }/>
      </Panel>
    </div>
  )
}

export default LiabilityDetailView
