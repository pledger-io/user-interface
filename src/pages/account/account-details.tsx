import { mdiCartPlus, mdiCashPlus, mdiSwapHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { Panel } from "primereact/panel";
import React, { FC, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams, useRouteLoaderData } from "react-router";
import TransactionList from "../../components/account/transaction-list.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BalanceChart from "../../components/graphs/balance-chart";
import CategorizedPieChart from "../../components/graphs/categorized-pie-chart";
import { YearMonth } from "../../components/layout/dropdown";
import Grid from "../../components/layout/grid.component";
import Loading from "../../components/layout/loading.component";
import { i10n } from "../../config/prime-locale";
import { Resolver } from "../../core";
import DateRangeService from "../../service/date-range.service";
import { ROUTER_ACCOUNT_KEY, RouterAccount } from "../../types/router-types";
import { ConfirmDialog } from "primereact/confirmdialog";

const TYPE_MAPPING = {
  expense: 'creditor',
  revenue: 'debtor',
  own: 'accounts',
  liability: 'liability'
}

type AccountType = keyof typeof TYPE_MAPPING

const AccountDetailView: FC = () => {
  const [range, setRange] = useState(DateRangeService.currentMonth())
  const { id, type, year, month } = useParams()
  const navigate = useNavigate()
  const account: RouterAccount = useRouteLoaderData(ROUTER_ACCOUNT_KEY)

  useEffect(() => {
    if (year && month) setRange(DateRangeService.forMonth(parseInt(year), parseInt(month)))
  }, [year, month])

  if (!account) {
    return <Loading/>
  }

  const isOwnType = type === 'own'
  const onDateChange = ({ year, month }: { month: number, year: number }) =>
    navigate(`/accounts/${ type }/${ id }/transactions/${ year }/${ month }`)

  const maxDate = DateRangeService.currentMonth().shiftDays(300).startDate()
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.accounts'/>
      { type && <BreadCrumbItem label={ `page.nav.accounts.${ TYPE_MAPPING[type as AccountType] }` }/> }
      <BreadCrumbItem message={ account.name }/>

      <BreadCrumbMenu>
        <YearMonth
          onChange={ onDateChange }
          minDate={ account.history?.firstTransaction ? new Date(account.history.firstTransaction) : new Date() }
          maxDate={ maxDate }
          selected={ { month: range.month(), year: range.year() } }/>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <div className='flex flex-col gap-2 p-2'>
      { isOwnType && <>
        <Panel header={ i10n('common.account.balance') }>
          <BalanceChart id='dashboard-balance-graph'
                        accounts={ account }
                        allMoney={ true }/>
        </Panel>

        <Grid type='column' minWidth='20em' className='hidden md:grid'>
          <Panel header={ i10n('page.transactions.expense.category') }>
            <CategorizedPieChart id='category-expenses'
                                 incomeOnly={ false }
                                 accounts={ account }
                                 split='category'/>
          </Panel>
          <Panel header={ i10n('page.transactions.expense.budget') }>
            <CategorizedPieChart id='budget-expenses'
                                 incomeOnly={ false }
                                 accounts={ account }
                                 split='budget'/>
          </Panel>
          <Panel header={ i10n('page.transactions.income.category') }>
            <CategorizedPieChart id='category-income'
                                 incomeOnly={ true }
                                 accounts={ account }
                                 split='category'/>
          </Panel>
        </Grid>
      </> }

      <Panel header={ i10n('page.title.transactions.overview') }>
        <div className='flex justify-end gap-2'>
          { (!Resolver.Account.isManaged(account) || Resolver.Account.isCreditor(account)) &&
            <NavLink to={ `${ Resolver.Account.resolveUrl(account) }/transactions/add/debit` }
                     className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
              <Icon path={ mdiCashPlus } size={ .8 }/> { i10n('page.transactions.debit.add') }
            </NavLink> }
          { (!Resolver.Account.isManaged(account) || Resolver.Account.isDebtor(account)) &&
            <NavLink to={ `${ Resolver.Account.resolveUrl(account) }/transactions/add/credit` }
                     className='p-button p-button-warning p-button-sm !mb-4 gap-1 items-center'>
              <Icon path={ mdiCartPlus } size={ .8 }/> { i10n('page.transactions.credit.add') }
            </NavLink> }
          { !Resolver.Account.isManaged(account) &&
            <NavLink to={ `${ Resolver.Account.resolveUrl(account) }/transactions/add/transfer` }
                     className='p-button p-button-primary p-button-sm !mb-4 gap-1 items-center'>
              <Icon path={ mdiSwapHorizontal } size={ .8 }/> { i10n('page.transactions.transfer.add') }
            </NavLink> }
        </div>

        <TransactionList range={ range } account={ account }/>
      </Panel>
    </div>
  </>
}

export default AccountDetailView
