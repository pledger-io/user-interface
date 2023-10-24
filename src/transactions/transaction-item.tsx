import React, {FC, useState} from "react";
import {Account, Transaction} from "../core/types";
import {Buttons, Dialog, Formats, Resolver, Translations} from "../core";
import {NavLink} from "react-router-dom";
import {mdiChevronLeftBox, mdiChevronRightBox, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import TransactionSplitDialog from "./TransactionSplitDialog";
import {ScheduleTransactionDialog} from "./schedule/ScheduleTransactionDialog";

type TransactionItemProps = {
    transaction: Transaction,
    account?: Account,
    className?: string
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction, className = '' , account }) => {

    const isSource = account && account.id === transaction.source.id
    const otherAccount = isSource ? transaction.destination : transaction.source
    const amount = isSource ? (-transaction.amount) : transaction.amount

    const onDelete = () => void 0

    return <div className={`${className} flex content-between gap-3 pb-2`}>
        <span className='text-[.9em] w-[12em]'>
            { transaction.metadata.budget &&
                <div className='text-gray-400'>
                    { transaction.metadata.budget }
                </div> }
            { transaction.metadata.category &&
                <div className='text-gray-400 text-[.8em]'>
                    { transaction.metadata.category }
                </div> }
        </span>
        <span className='flex flex-col flex-1'>
            <span className='text-[.9em]'>{ transaction.description }</span>
            <span className='text-gray-400'>
                <NavLink to={ `/accounts/${otherAccount.id}/transactions` }>
                    { otherAccount.name }
                </NavLink>
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

const ActionExpander = ({transaction, onDelete} : {transaction: Transaction, onDelete: () => void }) => {
    const [expanded, setExpanded] = useState(false)

    return <div className='!flex justify-start items-stretch gap-2'>
        { !expanded && <Buttons.Button variant='icon'
                                       className='opacity-70 !text-gray-500'
                                       icon={ mdiChevronRightBox }
                                       onClick={ () => setExpanded(true) }/> }
        <div className={`${expanded ? '[&>*]:inline-flex max-w-[20em] opacity-100' : 'max-w-0 overflow-hidden opacity-0'} flex h-[2em] gap-1 transition ease-in-out duration-300`}>
            <ScheduleTransactionDialog transaction={ transaction } iconStyle={ true }/>
            {transaction.split && <TransactionSplitDialog transaction={ transaction }/>}
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