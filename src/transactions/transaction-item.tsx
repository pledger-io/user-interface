import React, { FC, useState } from "react";
import { Account, Transaction } from "../core/types";
import { Buttons, Dialog, Formats, Layout, Notifications, Resolver, Translations } from "../core";
import { NavLink } from "react-router-dom";
import {
    mdiAlert,
    mdiArrowRight,
    mdiChevronLeftBox,
    mdiChevronRightBox,
    mdiFileSign,
    mdiSquareEditOutline,
    mdiTrashCanOutline
} from "@mdi/js";
import TransactionSplitDialog from "./TransactionSplitDialog";
import { ScheduleTransactionDialog } from "./schedule/ScheduleTransactionDialog";
import Icon from "@mdi/react";
import { TransactionRepository } from "../core/RestAPI";

type TransactionItemProps = {
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

const TransactionItem: FC<TransactionItemProps> = ({ transaction, className = '' , account }) => {
    const [deleted, setDeleted] = useState(false)

    const isSource = !account || account.id === transaction.source.id
    const sourceAccount = isSource ? transaction.source : transaction.destination
    const otherAccount = isSource ? transaction.destination : transaction.source
    const amount = determineAmount(transaction, account)

    const onDelete = () => {
        TransactionRepository.delete(transaction.source.id, transaction.id)
            .then(() => Notifications.Service.success('page.transactions.delete.success'))
            .then(() => setDeleted(true))
            .catch(() => Notifications.Service.warning('page.transactions.delete.failed'))
    }

    if (deleted) return null
    return <div className={`${className} flex content-between gap-3 mb-1 pb-1 border-b-[1px] border-gray-100 last:border-none`}>
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
        { transaction.metadata.failureCode && <span className='text-warning my-auto'>
            <Icon path={ mdiAlert } size={ 1 }/>
        </span> }
        <span className='flex flex-col flex-1'>
            <span className='text-[.9em] md:text-[1em]'>{ transaction.description }</span>
            { transaction.metadata.tags && <div className='flex gap-1'>
                { transaction.metadata.tags.map(t => <Layout.Tag key={ t } label={ t }/>) }
            </div> }
            <span className='text-gray-400 flex items-center gap-0.5'>
                { !account && <>
                    <NavLink to={ `/accounts/${sourceAccount.id}/transactions` } className='text-gray-400 hover:text-blue-400'>
                        { sourceAccount.name }
                    </NavLink>
                    <Icon path={ mdiArrowRight } size={ .6 } className='inline-block' />
                    <NavLink to={ `/accounts/${otherAccount.id}/transactions` } className='text-gray-400 hover:text-blue-400'>
                        { otherAccount.name }
                    </NavLink>
                </> }
                { account && <>
                    <NavLink to={ `/accounts/${otherAccount.id}/transactions` } className='text-gray-400 hover:text-blue-400'>
                        { otherAccount.name }
                    </NavLink>
                </> }
                { transaction.metadata.contract &&
                    <div className='hidden md:flex text-cyan-500 text-[.8em] pt-[.2em] ml-4 gap-0.5 items-center'
                         title='Contract'>
                        <Icon path={mdiFileSign} size={.52} />
                        <span>{ transaction.metadata.contract }</span>
                    </div>
                }
            </span>
            <span className='text-[.9em] [&>*]:inline-block'>
                <ActionExpander transaction={ transaction } onDelete={ onDelete } />
            </span>
        </span>
        <span className=''>
            <Formats.Money money={ amount }
                           currency={ transaction.currency }/>
        </span>
    </div>
}

const ActionExpander = ({ transaction, onDelete } : { transaction: Transaction, onDelete: () => void }) => {
    const [expanded, setExpanded] = useState(false)

    return <div className='!flex justify-start items-stretch gap-2'>
        { !expanded && <Buttons.Button variant='icon'
                                       className='opacity-40 !text-gray-500'
                                       icon={ mdiChevronRightBox }
                                       onClick={ () => setExpanded(true) }/> }
        <div className={`${expanded ? '[&>*]:inline-flex max-w-[35em] opacity-100' : 'max-w-0 overflow-hidden opacity-0'} flex h-[2em] gap-1 transition ease-in-out duration-300`}>
            <ScheduleTransactionDialog transaction={ transaction } iconStyle={ true }/>
            {transaction.split && <TransactionSplitDialog transaction={ transaction } iconStyle={ true }/>}
            <Buttons.Button variant='icon'
                            label='common.action.edit'
                            variantType='outline'
                            icon={ mdiSquareEditOutline }
                            href={ `${Resolver.Transaction.resolveUrl(transaction)}/edit` }/>
            <Dialog.ConfirmPopup title='common.action.delete'
                                 openButton={<Buttons.Button variant='icon'
                                                             label='common.action.delete'
                                                             className='text-warning'
                                                             icon={ mdiTrashCanOutline }/>}
                                 onConfirm={ onDelete }>
                <Translations.Translation label='page.transactions.delete.confirm'/>
            </Dialog.ConfirmPopup>
        </div>
        { expanded && <Buttons.Button variant='icon'
                                      className='opacity-70 !text-gray-500'
                                      icon={ mdiChevronLeftBox }
                                      onClick={ () => setExpanded(false) }/>}
    </div>
}

export default TransactionItem