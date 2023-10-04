import React, {FC, useEffect, useState} from "react";
import {Account, Transaction} from "../../core/types";
import {Attachments, Buttons, Dialog, Formats, Resolver, Translations} from "../../core";
import Icon from "@mdi/react";
import {
    mdiArrowLeftThin,
    mdiArrowRightThin,
    mdiDotsVertical,
    mdiSquareEditOutline,
    mdiSwapHorizontal,
    mdiTable, mdiTrashCanOutline
} from "@mdi/js";
import TransactionOverviewUrl from "../transaction-overview-url";
import {Dropdown} from "../../core/dropdown";
import TransactionSplitDialog from "../TransactionSplitDialog";
import {ScheduleTransactionDialog} from "../schedule/ScheduleTransactionDialog";

const ICON_TYPE_LOOKUP = {
    DEBIT: mdiArrowLeftThin,
    CREDIT: mdiArrowRightThin,
    TRANSFER: mdiSwapHorizontal
}

type TransactionRowProps = {
    account?: Account,
    transaction: Transaction
}

export const TransactionRow: FC<TransactionRowProps> = ({ account, transaction }) => {
    const [accountIcon, setAccountIcon] = useState<string>()
    const [opposite, setOpposite] = useState<Account>()
    const [displayAmount, setDisplayAmount] = useState(0)

    const dropDownActions = {close: () => undefined}

    useEffect(() => {
        const sourceManaged = Resolver.Account.isManaged(transaction.source)
        const accountIsSource = account?.id === transaction.source.id

        setAccountIcon(sourceManaged ? transaction.source.iconFileCode : transaction.destination.iconFileCode)

        if (account) setOpposite(accountIsSource ? transaction.destination : transaction.source)

        if (accountIsSource || (!sourceManaged && Resolver.Account.isManaged(transaction.destination))) {
            setDisplayAmount(-1 * transaction.amount)
        } else {
            setDisplayAmount(transaction.amount)
        }
    }, [transaction, account])

    const onDelete = () => {

    }

    return <>
        <tr>
            <td>
                <input type='checkbox' className='Select'/>
            </td>
            <td>
                <Formats.Date date={ transaction.dates.transaction }/><br/>
                {/*<Icon path={ ICON_TYPE_LOOKUP[transaction.type.code] } size={.8} />*/}
            </td>
            { account == null && <>
                <td><TransactionOverviewUrl account={ transaction.source } transaction={ transaction } /></td>
                <td>{ accountIcon && <Attachments.Image fileCode={accountIcon} /> }</td>
                <td><TransactionOverviewUrl account={ transaction.destination } transaction={ transaction } /></td>
            </>}
            { opposite != null && <>
                <td>{ accountIcon && <Attachments.Image fileCode={ accountIcon } /> }</td>
                <td>
                    <TransactionOverviewUrl account={ opposite } transaction={ transaction } />
                    { transaction.split && (<Icon path={ mdiTable } size={ .6 } color='var(--app-text-muted-color)'/>) }
                </td>
            </>}
            <td>
                <div className='mb-1'>{ transaction.description }</div>
                { transaction.metadata.category && <div className='text-[.9em] text-gray-500'>
                    <label className='font-bold mr-1'><Translations.Translation label='Transaction.category' />:</label>
                    <span>{ transaction.metadata.category }</span>
                </div> }
                { transaction.metadata.budget && <div className='text-[.9em] text-gray-500'>
                    <label className='font-bold mr-1'><Translations.Translation label='Transaction.budget' />:</label>
                    <span>{ transaction.metadata.budget }</span>
                </div> }
                { transaction.metadata.contract && <div className='text-[.9em] text-gray-500'>
                    <label className='font-bold mr-1'><Translations.Translation label='Transaction.contract' />:</label>
                    <span>{ transaction.metadata.contract }</span>
                </div> }
            </td>
            <td><Formats.Money money={ displayAmount } currency={ transaction.currency } /></td>
            <td>
                <Dropdown  icon={ mdiDotsVertical } actions={ dropDownActions }>
                    <ScheduleTransactionDialog transaction={ transaction }/>
                    {transaction.split && <TransactionSplitDialog transaction={ transaction }/>}
                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    variantType='outline'
                                    icon={ mdiSquareEditOutline }
                                    href={ `${Resolver.Transaction.resolveUrl(transaction)}/edit` }/>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={<Buttons.Button label='common.action.delete'
                                                                     variant='warning'
                                                                     variantType='outline'
                                                                     icon={ mdiTrashCanOutline }/>}
                                         onConfirm={ onDelete }>
                        <Translations.Translation label='page.transactions.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown>
            </td>
        </tr>
    </>
}