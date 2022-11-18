import PropTypes from 'prop-types';
import React from "react";
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
import {TransactionSplitDialog} from "./TransactionSplitDialog";
import {EntityShapes} from "../config";
import {Attachments, Buttons, Dialog, Dropdown, Formats, Loading, Resolver, Translations, When} from "../core";

import '../assets/css/TransactionTable.scss'

const ICON_TYPE_LOOKUP = {
    DEBIT: mdiArrowLeftThin,
    CREDIT: mdiArrowRightThin,
    TRANSFER: mdiSwapHorizontal
}

class TransactionRow extends React.Component {
    static propTypes = {
        displayAccount: EntityShapes.Account,
        transaction: EntityShapes.Transaction
    }

    dropDownActions = {
        close: () => {}
    }

    render() {
        const {transaction, displayAccount} = this.props

        return <tr className='TransactionRow'
                   onMouseLeave={() => this.dropDownActions.close()}>
            <td>
                <input type='checkbox' className='Select'/>
            </td>
            <td>
                <Formats.Date date={transaction.dates.transaction}/>
                <Icon path={ICON_TYPE_LOOKUP[transaction.type.code]} size={.8} />
            </td>
            <When condition={displayAccount == null}>
                <td>{this.getAccountTransactionUri(transaction.source)}</td>
                <td>{this.getSourceImageCode()}</td>
                <td>{this.getAccountTransactionUri(transaction.destination)}</td>
            </When>
            {displayAccount && (
                <td>
                    {this.generateOpposite()}
                    {transaction.split && (<Icon path={mdiTable} size={.6} color='var(--app-text-muted-color)'/>)}
                </td>
            )}
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
            <td>
                {this.generateAmount()}
            </td>
            <td>
                <Dropdown.Dropdown icon={mdiDotsVertical} actions={this.dropDownActions}>
                    <ScheduleTransactionDialog transaction={transaction}/>
                    {transaction.split && (<TransactionSplitDialog transaction={transaction}/>)}
                    <Buttons.Button label='common.action.edit'
                                    variant='primary'
                                    variantType='outline'
                                    icon={mdiSquareEditOutline}
                                    href={this.getEditLink()}/>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                         openButton={<Buttons.Button label='common.action.delete'
                                                                     variant='warning'
                                                                     variantType='outline'
                                                                     icon={mdiTrashCanOutline}/>}
                                         onConfirm={this.delete.bind(this)}>
                        <Translations.Translation label='page.transactions.delete.confirm'/>
                    </Dialog.ConfirmPopup>
                </Dropdown.Dropdown>
            </td>
        </tr>
    }

    delete() {

    }

    getAccountTransactionUri(account) {
        const {transaction: {dates: {transaction}}} = this.props
        const transactionDate = new Date(transaction)

        return (
            <Link to={`${Resolver.Account.resolveUrl(account)}/transactions/${transactionDate.getFullYear()}/${transactionDate.getMonth() + 1}`}>
                {account.name}
            </Link>
        )
    }

    generateAmount() {
        const {transaction: {amount, source, destination, currency}, displayAccount} = this.props

        let multiplyFactor = 1
        if (displayAccount && source.id === displayAccount) {
            multiplyFactor = -1
        } else if (!Resolver.Account.isManaged(source) && Resolver.Account.isManaged(destination)) {
            multiplyFactor = -1
        }

        return <Formats.Money money={multiplyFactor * amount} currency={currency}/>
    }

    generateOpposite() {
        const {displayAccount, transaction: {source, destination}} = this.props
        const account = source.id === displayAccount?.id ? destination : source

        return this.getAccountTransactionUri(account)
    }

    getSourceImageCode() {
        const {transaction: {source, destination}} = this. props

        let fileCode = destination.iconFileCode
        if (Resolver.Account.isManaged(source)) {
            fileCode = source.iconFileCode
        }

        if (fileCode) {
            return <Attachments.Image fileCode={fileCode} />
        }

        return null
    }

    getEditLink() {
        const {displayAccount, transaction: {id, source}} = this.props
        const linkForAccount = displayAccount || source

        return `${Resolver.Account.resolveUrl(linkForAccount)}/transaction/${id}/edit`
    }
}

export class TransactionTable extends React.Component {
    static propTypes = {
        account: EntityShapes.Account,
        transactions: PropTypes.arrayOf(EntityShapes.Transaction)
    }

    render() {
        const {account, transactions} = this.props
        const transactionRows = (transactions || [])
            .map(t => <TransactionRow key={t.id} transaction={t} displayAccount={account}/>)

        return (
            <table className='Table Transactions'>
                <thead>
                <tr>
                    <th width='20'/>
                    <th width='90'><Translations.Translation label='Transaction.date'/></th>
                    <When condition={account == null}>
                        <th width='150'><Translations.Translation label='Transaction.source'/></th>
                    </When>
                    <th colSpan='2'><Translations.Translation label='Transaction.to'/></th>
                    <th><Translations.Translation label='Transaction.description'/></th>
                    <th width='75'><Translations.Translation label='Transaction.amount'/></th>
                    <th width='20'/>
                </tr>
                </thead>
                <tbody>
                <When condition={transactionRows.length > 0}>
                    {transactionRows}
                </When>
                <When condition={transactions !== null && transactionRows.length === 0}>
                    <tr className='NoResults'><td colSpan={8}><Translations.Translation label='common.overview.noresults'/></td></tr>
                </When>
                <When condition={transactions == null}>
                    <tr>
                        <td colSpan={8}>
                            <Loading />
                        </td>
                    </tr>
                </When>
                </tbody>
            </table>
        );
    }
}
