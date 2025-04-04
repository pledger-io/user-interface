import { mdiSwapHorizontal } from "@mdi/js";
import { Card } from "primereact/card";
import { ConfirmDialog } from "primereact/confirmdialog";
import React from "react";
import { useNavigate } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { YearMonth } from "../../components/layout/dropdown";
import { i10n } from "../../config/prime-locale";
import useDateRange from "../../hooks/date-range.hook";
import NewTransactionDialog from "../../components/transaction/transaction-dialog.component";
import TransactionOverview from "../../components/transaction/transaction-list.component";

const TransactionGlobalView = () => {
  const navigate = useNavigate()
  const [range] = useDateRange()

  const onDateChange = (year: number, month: number) =>
    navigate(`/transactions/transfers/${ year }/${ month }`)

  const header = () =>  <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.title.transactions.overview') }
  </div>

  return <div className='TransactionOverview'>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.accounting'/>
      <BreadCrumbItem label='page.nav.transactions'/>
      <BreadCrumbItem label='page.nav.transfers'/>

      <BreadCrumbMenu>
        <YearMonth
          onChange={ ({ year, month }) => onDateChange(year, month) }
          selected={ { month: range.month(), year: range.year() } }/>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <Card header={ header } className='mx-2 my-4'>
      <div className='flex justify-end gap-2 mb-4'>
        <NewTransactionDialog type='transfer' icon={ mdiSwapHorizontal } variant='info'/>
      </div>
      <TransactionOverview range={ range } transfers={ true }/>
    </Card>
  </div>
}

export default TransactionGlobalView;
