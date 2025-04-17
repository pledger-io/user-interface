import { mdiCashMinus, mdiCashPlus } from "@mdi/js";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import React from "react";
import { useNavigate } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import CategorizedPieChart from "../../components/graphs/categorized-pie-chart";
import { YearMonth } from "../../components/layout/dropdown";
import { GenerateTransaction } from "../../components/transaction/generate-transaction.component";
import NewTransactionDialog from "../../components/transaction/transaction-dialog.component";
import TransactionOverview from "../../components/transaction/transaction-list.component";
import { i10n } from "../../config/prime-locale";
import useDateRange from "../../hooks/date-range.hook";

const TransactionGlobalView = () => {
  const navigate = useNavigate()
  const [range] = useDateRange()

  const onDateChange = (year: number, month: number) =>
    navigate(`/transactions/income-expense/${ year }/${ month }`)

  return <div className='TransactionOverview'>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.accounting'/>
      <BreadCrumbItem label='page.nav.transactions'/>
      <BreadCrumbItem label='page.nav.incomeexpense'/>

      <BreadCrumbMenu>
        <YearMonth
          onChange={ ({ year, month }) => onDateChange(year, month) }
          selected={ { month: range.month(), year: range.year() } }/>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <div className='hidden lg:flex mx-2 gap-2 my-4 justify-normal'>
      <Panel header={ i10n('page.transactions.expense.category') }
             className='flex-1 overflow-hidden'>
        <CategorizedPieChart id='category-expense'
                             split='category'
                             incomeOnly={ false }/>
      </Panel>
      <Panel header={ i10n('page.transactions.expense.budget') }
             className='flex-1 overflow-hidden'>
        <CategorizedPieChart id='budget-expense'
                             split='budget'
                             incomeOnly={ false }/>
      </Panel>
      <Panel header={ i10n('page.transactions.income.category') }
             className='flex-1 overflow-hidden'>
        <CategorizedPieChart id='category-income'
                             split='category'
                             incomeOnly={ true }/>
      </Panel>
    </div>

    <Panel header={ i10n('page.title.transactions.overview') } className='mx-2'>
      <div className='flex justify-end gap-2'>
        <GenerateTransaction />
        <NewTransactionDialog type='debit' icon={ mdiCashPlus } variant='success'/>
        <NewTransactionDialog type='credit' icon={ mdiCashMinus } variant='warning'/>
      </div>

      <TransactionOverview range={ range } transfers={ false }/>
    </Panel>
  </div>
}

export default TransactionGlobalView;
