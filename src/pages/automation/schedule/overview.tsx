import { mdiCalendarCheck } from "@mdi/js";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import DateComponent from "../../../components/format/date.component";
import MoneyComponent from "../../../components/format/money.component";
import { Button } from "../../../components/layout/button";
import ScheduleTransactionDialog from "../../../components/transaction/schedule-dialog.component";
import ScheduleTransactionMenuComponent from "../../../components/transaction/schedule-transaction-menu.component";
import { i10n } from "../../../config/prime-locale";
import { Resolver } from "../../../core";
import { TransactionScheduleRepository } from "../../../core/RestAPI";
import { DialogOptions, ScheduledTransaction, ScheduledTransactionRange } from "../../../types/types";

const ScheduledTransactionOverview = () => {
  const [schedules, setSchedules] = useState<ScheduledTransaction[] | undefined>(undefined)
  const newScheduleDialogRef = useRef<DialogOptions>(null)

  const loadSchedules = () => TransactionScheduleRepository.list().then(setSchedules)
  useEffect(() => {
    loadSchedules()
  }, [])

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.budget.schedules.title') }
  </div>

  return (
    <div className="ScheduledTransactionOverview">
      <BreadCrumbs>
        <BreadCrumbItem label='page.nav.accounting'/>
        <BreadCrumbItem label='page.nav.automation'/>
        <BreadCrumbItem label='page.nav.budget.recurring'/>
      </BreadCrumbs>

      <Card header={ header } className='my-4 mx-2'>
        <div className='flex justify-end mb-4'>
          <Button label='page.transaction.action.recurring'
                  severity='success'
                  icon={ mdiCalendarCheck }
                  onClick={ () => newScheduleDialogRef.current?.open() }/>
        </div>
        <ScheduleTransactionDialog ref={ newScheduleDialogRef } onCreated={ loadSchedules }/>

        <DataTable value={ schedules } loading={ !schedules } size='small'>
          <Column header={ i10n('ScheduledTransaction.name') }
                  body={ (schedule: ScheduledTransaction) => <>
                    { schedule.name }
                    <div className='text-muted'>{ schedule.description }</div>
                  </> }/>
          <Column header={ i10n('page.budget.schedule.daterange') } body={ (schedule: ScheduledTransaction) => <DateRangeComponent range={ schedule.range }/> }/>
          <Column header={ i10n('ScheduledTransaction.source') }
                  body={ (schedule: ScheduledTransaction) => <NavLink to={ Resolver.Account.resolveUrl(schedule.source) + '/transactions' }>{ schedule.source.name }</NavLink> }/>
          <Column header={ i10n('ScheduledTransaction.destination') }
                  body={ (schedule: ScheduledTransaction) => <NavLink to={ Resolver.Account.resolveUrl(schedule.destination) + '/transactions' }>{ schedule.destination.name }</NavLink> }/>
          <Column header={ i10n('ScheduledTransaction.amount') }
                  headerClassName='w-[5rem]'
                  className='text-right!'
                  body={ (schedule: ScheduledTransaction) => <MoneyComponent money={ schedule.amount } currency={ schedule.source.account.currency }/>}/>
          <Column headerClassName='w-[2rem]' body={ schedule => <ScheduleTransactionMenuComponent schedule={ schedule } callback={ loadSchedules } /> }/>
        </DataTable>
      </Card>
    </div>)
}

const DateRangeComponent = ({ range }: { range?: ScheduledTransactionRange }) => {
  if (!range || !range?.start) return <></>
  return <>
    <DateComponent date={ range.start } /> - <DateComponent date={ range.end } />
  </>
}

export default ScheduledTransactionOverview
