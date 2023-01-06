import PropTypes from 'prop-types';
import React, {lazy, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {
    mdiArrowLeftThin,
    mdiArrowRightThin,
    mdiDotsVertical,
    mdiSquareEditOutline,
    mdiSwapHorizontal,
    mdiTable,
    mdiTrashCanOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import {ScheduleTransactionDialog} from "./schedule/ScheduleTransactionDialog";
import {EntityShapes} from "../config";
import {Attachments, Buttons, Dialog, Dropdown, Formats, Loading, Resolver, Translations, When} from "../core";
import '../assets/css/TransactionTable.scss'

const TransactionSplitDialog = lazy(() => import('./TransactionSplitDialog'))

const ICON_TYPE_LOOKUP = {
    DEBIT: mdiArrowLeftThin,
    CREDIT: mdiArrowRightThin,
    TRANSFER: mdiSwapHorizontal
}

const AccountTransactionUrl = ({account, transaction: {dates: {transaction}}}) => {
    const transactionDate = new Date(transaction)

    return (
        <Link to={`${Resolver.Account.resolveUrl(account)}/transactions/${transactionDate.getFullYear()}/${transactionDate.getMonth() + 1}`}>
            {account.name}
        </Link>
    )
}
AccountTransactionUrl.propTypes = {
    account: EntityShapes.Account,
    transaction: EntityShapes.Transaction
}

const TransactionRow = ({displayAccount = null, transaction}) => {
    const [accountIcon, setAccountIcon]     = useState()
    const [opposite, setOpposite]           = useState({})
    const [displayAmount, setDisplayAmount] = useState(0)

    const editUri = `${Resolver.Transaction.resolveUrl(transaction)}/edit`
    const dropDownActions = {}

    const onDelete = () => {

    }

    useEffect(() => {
        const sourceManaged = Resolver.Account.isManaged(transaction.source)
        const displayIsSource = displayAccount?.id === transaction.source.id

        if (sourceManaged) {
            setAccountIcon(transaction.source.iconFileCode)
        } else {
            setAccountIcon(transaction.destination.iconFileCode)
        }

        if (displayIsSource || (!sourceManaged && Resolver.Account.isManaged(transaction.destination))) {
            setDisplayAmount(-1 * transaction.amount)
        } else {
            setDisplayAmount(transaction.amount)
        }

        setOpposite(displayAccount?.id === transaction.source.id
            ? transaction.destination
            : transaction.source)
    }, [transaction, displayAccount])

    if (!transaction) return <tr></tr>

    return (
        <tr className='TransactionRow'
            onMouseLeave={() => dropDownActions.close()}>
            <td>
                <input type='checkbox' className='Select'/>
            </td>
            <td>
                <Formats.Date date={transaction.dates.transaction}/><br/>
                <Icon path={ICON_TYPE_LOOKUP[transaction.type.code]} size={.8} />
            </td>
            <When condition={displayAccount == null}>
                <td><AccountTransactionUrl account={transaction.source} transaction={transaction}/></td>
                <td>{ accountIcon && <Attachments.Image fileCode={accountIcon} /> }</td>
                <td><AccountTransactionUrl account={transaction.destination} transaction={transaction}/></td>
            </When>
            <When condition={displayAccount != null}>
                <td>{ accountIcon && <Attachments.Image fileCode={accountIcon} /> }</td>
                <td>
                    <AccountTransactionUrl account={opposite} transaction={transaction} />
                    {transaction.split && (<Icon path={mdiTable} size={.6} color='var(--app-text-muted-color)'/>)}
                </td>
            </When>
            <td>
                {transaction.description}
                <When condition={transaction.metadata.hasOwnProperty('category')}>
                    <div className="Summary">
                        <label><Translations.Translation label='Transaction.category'/></label>
                        {transaction.metadata.category}
                    </div>
                </When>
                <When condition={transaction.metadata.hasOwnProperty('budget')}>
                    <div className="Summary">
                        <label><Translations.Translation label='Transaction.budget'/></label>
                        {transaction.metadata.budget}
                    </div>
                </When>
                <When condition={transaction.metadata.hasOwnProperty('contract')}>
                    <div className="Summary">
                        <label><Translations.Translation label='Transaction.contract'/></label>
                        {transaction.metadata.contract}
                    </div>
                </When>
            </td>
            <td><Formats.Money money={displayAmount} currency={transaction.currency} /></td>
            <td>
                <Dropdown.Dropdown icon={mdiDotsVertical} actions={dropDownActions}>
                    <ScheduleTransactionDialog transaction={transaction}/>
                    {transaction.split && (<TransactionSplitDialog transaction={transaction}/>)}
                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    variantType='outline'
                                    icon={mdiSquareEditOutline}
                                    href={editUri}/>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={<Buttons.Button label='common.action.delete'
                                                                     variant='warning'
                                                                     variantType='outline'
                                                                     icon={mdiTrashCanOutline}/>}
                                         onConfirm={onDelete}>
                        <Translations.Translation label='page.transactions.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            </td>
        </tr>
    )
}
TransactionRow.propTypes = {
    displayAccount: EntityShapes.Account,
    transaction: EntityShapes.Transaction
}

export const TransactionTable = ({account = null, transactions}) => {
    const [transactionRows, setTransactionRows] = useState()

    useEffect(() => {
        let rows = undefined
        if (transactions) rows = transactions.map(t => <TransactionRow key={t.id} transaction={t} displayAccount={account} />)
        setTransactionRows(rows)
    }, [account, transactions])

    return (
        <table className='Table Transactions'>
            <thead>
            <tr>
                <th width='20'/>
                <th width='90'><Translations.Translation label='Transaction.date'/></th>
                { account == null && (
                    <th width='150'><Translations.Translation label='Transaction.source'/></th>
                )}
                <th colSpan='2'><Translations.Translation label='Transaction.to'/></th>
                <th><Translations.Translation label='Transaction.description'/></th>
                <th width='75'><Translations.Translation label='Transaction.amount'/></th>
                <th width='20'/>
            </tr>
            </thead>
            <tbody>
            { !transactionRows && (
                <tr><td colSpan={account ? 7 : 8}><Loading /></td></tr>
            )}
            { transactionRows && transactionRows.length === 0 && (
                <tr>
                    <td colSpan={account ? 7 : 8} style={{textAlign: 'center', color: 'grey'}}><Translations.Translation label='common.overview.noresults'/></td>
                </tr>
            )}
            { transactionRows && transactionRows.length > 0 && transactionRows }
            </tbody>
        </table>
    );
}
TransactionTable.propTypes = {
    // The account that the transactions are for, null if none
    account: EntityShapes.Account,
    // the list of transactions
    transactions: PropTypes.arrayOf(EntityShapes.Transaction)
}
