import {  mdiSwapHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import React from "react";
import { NavLink, useRouteLoaderData } from "react-router";
import SavingGoalTableComponent from "../../../components/account/saving/saving-goal-table.component";
import SavingSummaryComponent from "../../../components/account/saving/saving-goal.component";
import TransactionListComponent from "../../../components/account/saving/transaction-list.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import { RouterAccount } from "../../../types/router-types";

function SavingAccountOverview() {
  const account: RouterAccount = useRouteLoaderData('savings')

  if (!account) return null
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.accounts'/>l
      <BreadCrumbItem label='page.nav.accounts.savings'/>
      <BreadCrumbItem message={ account?.name || 'Loading...' }/>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <Panel header={ i10n('page.account.savings.goals') } className='py-4 px-2 !shadow-none'>
      <SavingSummaryComponent savingAccount={ account }/>
      <hr className='my-5'/>
      <SavingGoalTableComponent account={ account }/>
    </Panel>

    <Panel header={ i10n('page.account.savings.transactions') } className='py-4 px-2'>
      <div className='flex justify-end mb-2'>
        <NavLink to={ `${ Resolver.Account.resolveUrl(account) }/transactions/add/transfer` }
                 className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
          <Icon path={ mdiSwapHorizontal } size={ 1 }/> { i10n('page.transactions.transfer.add') }
        </NavLink>
      </div>

      <TransactionListComponent account={ account }/>
    </Panel>
  </>
}

export default SavingAccountOverview
