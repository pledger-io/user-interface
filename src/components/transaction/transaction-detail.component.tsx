import {
  mdiAlert,
  mdiArrowRight,
  mdiCalendarCheck,
  mdiChevronLeftBox,
  mdiChevronRightBox,
  mdiFileSign,
  mdiSquareEditOutline,
  mdiTable,
  mdiTrashCanOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { Attributes, FC, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { Resolver } from "../../core";
import { TransactionRepository } from "../../core/RestAPI";
import NotificationService from "../../service/notification.service";
import { Account, DialogOptions, Transaction } from "../../types/types";
import { confirmDeleteDialog } from "../confirm-dialog";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import Tag from "../layout/tag.component";
import ScheduleTransactionDialog from "./schedule-dialog.component";
import TransactionSplitDialog from "./split-dialog.component";

type TransactionItemProps = Attributes & {
  transaction: Transaction,
  account?: Account,
  className?: string
}

function determineAmount(transaction: Transaction, account?: Account) {
  if (account) {
    const isSource = !account || account.id === transaction.source.id
    return isSource ? (-transaction.amount) : transaction.amount
  }

  const sourceManaged = Resolver.Account.isManaged(transaction.source)
  return sourceManaged ? transaction.amount : -transaction.amount
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction, className = '', account }) => {
  const [deleted, setDeleted] = useState(false)

  const isSource = !account || account.id === transaction.source.id
  const sourceAccount = isSource ? transaction.source : transaction.destination
  const otherAccount = isSource ? transaction.destination : transaction.source
  const amount = determineAmount(transaction, account)
  const transactionDate = new Date(transaction.dates.transaction)

  const onDelete = () => {
    TransactionRepository.delete(transaction.source.id, transaction.id)
      .then(() => NotificationService.success('page.transactions.delete.success'))
      .then(() => setDeleted(true))
      .catch(() => NotificationService.warning('page.transactions.delete.failed'))
  }

  if (deleted) return null
  return <div className={ `${ className } flex content-between gap-3 px-2 mb-1 pb-1 border-b-[1px] border-gray-100 last:border-none` }>
        <span className='text-[.9em] md:text-[1em] md:w-[12em] w-[6em]'>
            { transaction.metadata.budget &&
              <div className='text-gray-400'>
                { transaction.metadata.budget }
              </div> }
          { transaction.metadata.category &&
            <div className='text-gray-400 text-[.8em]'>
              { transaction.metadata.category }
            </div> }
        </span>
        { transaction.metadata.failureCode &&
          <span className='text-warning my-auto'>
                    <Icon path={ mdiAlert } size={ 1 }/>
                </span> }
        <span className='flex flex-col flex-1'>
          <span className='text-[.9em] md:text-[1em]'>{ transaction.description }</span>
          { transaction.metadata.tags && <div className='flex gap-1'> { transaction.metadata.tags.map(t => <Tag key={ t } label={ t }/>) } </div> }
        <span className='text-gray-400 flex items-center gap-0.5'>
          { !account && <>
            <NavLink
              to={ `${ Resolver.Account.resolveUrl(sourceAccount) }/transactions/${ transactionDate.getFullYear() }/${ transactionDate.getMonth() + 1 }` }
              className='text-gray-400 hover:text-blue-400'>
              { sourceAccount.name }
            </NavLink>
            <Icon path={ mdiArrowRight } size={ .6 } className='inline-block'/>
            <NavLink
              to={ `${ Resolver.Account.resolveUrl(otherAccount) }/transactions/${ transactionDate.getFullYear() }/${ transactionDate.getMonth() + 1 }` }
              className='text-gray-400 hover:text-blue-400'>
              { otherAccount.name }
            </NavLink>
          </> }
          { account && <>
            <NavLink
              to={ `${ Resolver.Account.resolveUrl(otherAccount) }/transactions/${ transactionDate.getFullYear() }/${ transactionDate.getMonth() + 1 }` }
              className='text-gray-400 hover:text-blue-400'>
              { otherAccount.name }
            </NavLink>
          </> }
          { transaction.metadata.contract &&
            <div className='hidden md:flex text-cyan-500 text-[.8em] pt-[.2em] ml-4 gap-0.5 items-center'
                 title='Contract'>
              <Icon path={ mdiFileSign } size={ .52 }/>
              <span>{ transaction.metadata.contract }</span>
            </div>
          }
        </span>
        <span className='text-[.9em] *:inline-block'>
            <ActionExpander transaction={ transaction } onDelete={ onDelete }/>
        </span>
    </span>
    <span className=''><MoneyComponent money={ amount } currency={ transaction.currency }/></span>
  </div>
}

const ActionExpander = ({ transaction, onDelete }: { transaction: Transaction, onDelete: () => void }) => {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const scheduleDialogRef = useRef<DialogOptions>(null)
  const splitDialogRef = useRef<DialogOptions>(null)

  const confirmDeleteClick = () => {
    confirmDeleteDialog({
      message: i10n('page.transactions.delete.confirm'),
      accept: onDelete
    })
  }

  return <div className='flex! justify-start items-stretch gap-2'>
    { !expanded &&
      <a onClick={ () => setExpanded(true)} className='text-muted cursor-pointer opacity-40'>
        <Icon path={ mdiChevronRightBox } size={ 1 } />
      </a>
    }
    <div
      className={ `${ expanded ? '*:inline-flex opacity-100' : 'max-w-0 overflow-hidden opacity-0' } flex h-[2em] gap-1 transition ease-in-out duration-300` }>
      <ScheduleTransactionDialog ref={ scheduleDialogRef } transaction={ transaction } />
      <Button label='page.transaction.action.recurring'
              outlined
              severity='secondary'
              icon={ mdiCalendarCheck }
              onClick={ () => scheduleDialogRef.current?.open() }/>
      { transaction.split &&
        <>
          <Button label='page.transaction.action.details'
                  outlined
                  severity='help'
                  icon={ mdiTable }
                  onClick={ () => splitDialogRef.current?.open() }/>
          <TransactionSplitDialog transaction={ transaction } ref={ splitDialogRef }/>
        </>
      }
      <Button label='common.action.edit'
              outlined
              icon={ mdiSquareEditOutline }
              onClick={ () => navigate( `${ Resolver.Transaction.resolveUrl(transaction) }/edit`) }/>
      <Button label='common.action.delete'
              outlined
              icon={ mdiTrashCanOutline }
              severity='danger'
              onClick={ confirmDeleteClick }/>
    </div>
    { expanded &&
      <a onClick={ () => setExpanded(false) } className='text-muted cursor-pointer opacity-40'>
        <Icon path={ mdiChevronLeftBox } size={ 1 } />
      </a>
    }
  </div>
}

export default TransactionItem
