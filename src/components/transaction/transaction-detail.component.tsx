import {
  mdiAlert,
  mdiArrowRight,
  mdiCalendarCheck, mdiDotsVertical,
  mdiFileSign,
  mdiSquareEditOutline,
  mdiTable,
  mdiTrashCanOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { Attributes, FC, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import { Resolver } from "../../core";
import { TransactionRepository } from "../../core/RestAPI";
import { Account, AccountRef, DialogOptions, Transaction } from "../../types/types";
import { confirmDeleteDialog } from "../confirm-dialog";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import Tag from "../layout/tag.component";
import ScheduleTransactionDialog from "./schedule-dialog.component";
import TransactionSplitDialog from "./split-dialog.component";

type TransactionItemProps = Attributes & {
  transaction: Transaction,
  account?: AccountRef,
  className?: string
}

function determineAmount(transaction: Transaction, account?: AccountRef) {
  if (account) {
    const isSource = !account || account.id === transaction.source.id
    return isSource ? (-transaction.amount) : transaction.amount
  }

  const sourceManaged = Resolver.Account.isManaged(transaction.source)
  return sourceManaged ? transaction.amount : -transaction.amount
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction, className = '', account }) => {
  const [deleted, setDeleted] = useState(false)
  const { warning, success } = useNotification()
  const navigate = useNavigate()

  const isSource = !account || account.id === transaction.source.id
  const sourceAccount = isSource ? transaction.source : transaction.destination
  const otherAccount = isSource ? transaction.destination : transaction.source
  const amount = determineAmount(transaction, account)
  const transactionDate = new Date(transaction.dates.transaction)

  const onDelete = () => {
    TransactionRepository.delete(transaction.source.id, transaction.id)
      .then(() => success('page.transactions.delete.success'))
      .then(() => setDeleted(true))
      .catch(() => warning('page.transactions.delete.failed'))
  }

  const onEditClick = () => {
    // only do this when display width < 768px
    if (window.innerWidth < 768) {
      navigate(`${ Resolver.Transaction.resolveUrl(transaction) }/edit`)
    }
  }

  if (deleted) return null
  return <div className={ `${ className } flex content-between gap-3 px-2 border-b-[1px] my-0.5 border-gray-100 last:border-none` }>
    <span className='text-[.9em] md:text-[1em] md:w-[12em] w-[6em]' onClick={ onEditClick }>
        { transaction.metadata.budget &&
          <div className='text-gray-400'>
            { transaction.metadata.budget }
          </div>
        }
        { transaction.metadata.category &&
          <div className='text-gray-400 text-[.8em]'>
            { transaction.metadata.category }
          </div>
        }
    </span>
    { transaction.metadata.failureCode &&
      <span className='text-warning my-auto'>
        <Icon path={ mdiAlert } size={ 1 }/>
      </span>
    }
    <span className='flex flex-col flex-1'>
      <span className='text-[.9em] md:text-[1em]' onClick={ onEditClick }>{ transaction.description }</span>
      { transaction.metadata.tags &&
        <div className='flex gap-1'> { transaction.metadata.tags.map(t => <Tag key={ t } label={ t }/>) } </div>
      }
      <span className='text-gray-400 flex items-center gap-0.5 text-[.95em]'>
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
          </>
        }
        { account && <>
            <NavLink
              to={ `${ Resolver.Account.resolveUrl(otherAccount) }/transactions/${ transactionDate.getFullYear() }/${ transactionDate.getMonth() + 1 }` }
              className='text-gray-400 hover:text-blue-400'>
              { otherAccount.name }
            </NavLink>
          </>
        }
        { transaction.metadata.contract &&
          <div className='hidden md:flex text-cyan-500 text-[.8em] pt-[.2em] ml-4 gap-0.5 items-center'
               title='Contract'>
            <Icon path={ mdiFileSign } size={ .52 }/>
            <span>{ transaction.metadata.contract }</span>
          </div>
        }
        </span>
    </span>
    <ActionExpander transaction={ transaction } onDelete={ onDelete }/>
    <span className='w-[5rem] text-right' onClick={ onEditClick }><MoneyComponent money={ amount } currency={ transaction.currency }/></span>
  </div>
}

const ActionExpander = ({ transaction, onDelete }: { transaction: Transaction, onDelete: () => void }) => {
  const navigate = useNavigate()
  const scheduleDialogRef = useRef<DialogOptions>(null)
  const splitDialogRef = useRef<DialogOptions>(null)

  const confirmDeleteClick = () => {
    confirmDeleteDialog({
      message: i10n('page.transactions.delete.confirm'),
      accept: onDelete
    })
  }

  return <div className='gap-0.5 hidden md:flex'>
      <ScheduleTransactionDialog ref={ scheduleDialogRef } transaction={ transaction }/>
      <Button tooltip={ i10n('page.transaction.action.recurring') }
              text
              size='small'
              severity='secondary'
              className='opacity-30 hover:opacity-100 p-0!'
              icon={ mdiCalendarCheck }
              onClick={ () => scheduleDialogRef.current?.open() }/>
      { transaction.split &&
        <>
          <Button tooltip={ i10n('page.transaction.action.details') }
                  text
                  severity='help'
                  icon={ mdiTable }
                  className='opacity-30 hover:opacity-100 p-0!'
                  onClick={ () => splitDialogRef.current?.open() }/>
          <TransactionSplitDialog transaction={ transaction } ref={ splitDialogRef }/>
        </>
      }
      <Button tooltip={ i10n('common.action.edit') }
              text
              size='small'
              icon={ mdiSquareEditOutline }
              className='opacity-30 hover:opacity-100 p-0!'
              onClick={ () => navigate(`${ Resolver.Transaction.resolveUrl(transaction) }/edit`) }/>
      <Button tooltip={ i10n('common.action.delete') }
              text
              size='small'
              icon={ mdiTrashCanOutline }
              severity='danger'
              className='opacity-30 hover:opacity-100 p-0!'
              onClick={ confirmDeleteClick }/>
  </div>
}

export default TransactionItem
