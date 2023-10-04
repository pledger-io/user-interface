import React, {FC, ReactElement, useEffect, useState} from "react";
import {Account, Transaction} from "../../core/types";
import {Layout, Translations} from "../../core";
import {TransactionRow} from "./transaction-row";

type TransactionTableProps = {
    account?: Account,
    transactions: Transaction[]
}

export const TransactionTable: FC<TransactionTableProps> = ({account, transactions}) => {
    const [transactionRows, setTransactionRows] = useState<ReactElement[]>()

    useEffect(() => {
        if (!transactions) {
            setTransactionRows(undefined)
        } else {
            setTransactionRows(transactions.map(t => <TransactionRow key={ t.id } account={ account } transaction={ t } />))
        }
    }, [account, transactions])

    return <>
        <table className='Table Transactions'>
            <thead>
            <tr>
                <th className='w-[20px]'/>
                <th className='w-[90px]'>
                    <Translations.Translation label='Transaction.date'/>
                </th>
                { account == null && (
                    <th className='w-[200px]'><Translations.Translation label='Transaction.source'/></th>
                )}
                <th className='w-[200px]' colSpan={ 2 }>
                    <Translations.Translation label='Transaction.to'/>
                </th>
                <th>
                    <Translations.Translation label='Transaction.description'/>
                </th>
                <th className='w-[70px]'><Translations.Translation label='Transaction.amount'/></th>
                <th className='w-[20px]'/>
            </tr>
            </thead>
            <tbody>
            { !transactionRows && <tr><td colSpan={account ? 7 : 8}><Layout.Loading /></td></tr> }
            { transactionRows && transactionRows.length > 0 && transactionRows }
            { transactionRows && transactionRows.length === 0 && (
                <tr>
                    <td colSpan={account ? 7 : 8} style={{textAlign: 'center', color: 'grey'}}><Translations.Translation label='common.overview.noresults'/></td>
                </tr>
            ) }
            </tbody>
        </table>
    </>
}