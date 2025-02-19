import React, { FC, useEffect, useState } from "react";
import TransactionItem from "../../components/transaction/transaction-detail.component";
import { Resolver } from "../../core";
import { groupTransactionByDay, YearlyTransactions } from "../../reducers";
import AccountRepository from "../../core/repositories/account-repository";
import { Account, Pagination } from "../../types/types";
import useQueryParam from "../../hooks/query-param.hook";
import MoneyComponent from "../format/money.component";
import DateRange from "../../types/date-range.type";

import Loading from "../layout/loading.component";
import { Paginator } from "../layout/paginator.component";
import Translation from "../localization/translation.component";

type TransactionListProps = {
    account: Account,
    range: DateRange
}

const TransactionList: FC<TransactionListProps> = ({ account, range }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [transactions, setTransactions] = useState<YearlyTransactions>()
    const [pagination, setPagination] = useState<Pagination>()

    useEffect(() => {
        setTransactions(undefined)
        AccountRepository.transactions(account.id, range, page)
            .then(result => {
                const transactions = (result.content || [])
                    .reduce(groupTransactionByDay, {})
                setTransactions(transactions)
                setPagination(result.info)
            })
            .catch(console.log)
    }, [ page, account, range ]);

    const isManaged = Resolver.Account.isManaged(account)
    const isLoaded = transactions
    const hasTransactions = transactions && Object.keys(transactions).length > 0
    return <>
        { !isLoaded && <Loading/> }

        { isLoaded && !hasTransactions && <div className='text-center text-gray-500'>
            <Translation label='common.overview.noresults' />
        </div> }

        { hasTransactions && Object.keys(transactions).map(key => {
            const date = new Date(key)
            const expense = transactions[key]
                .filter(t => (!isManaged && Resolver.Transaction.isCredit(t)) || (isManaged && Resolver.Transaction.isDebit(t)))
                .reduce((a, t) => a - t.amount, 0)
            const income = transactions[key]
                .filter(t => (!isManaged && Resolver.Transaction.isDebit(t)) || (isManaged && Resolver.Transaction.isCredit(t)))
                .reduce((a, t) => a + t.amount, 0)

            return <div key={key} className='flex flex-col gap-0.5 pb-1'>
                <div className='flex gap-2 items-center border-b-[1px] py-0.5 mb-1 bg-blue-200 bg-opacity-10 rounded-lg px-2'>
                    <div className='font-bold text-lg[1.5em] text-muted'>
                        { date.getDate() }
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[.9em] text-neutral-500'>
                            { `${date.getFullYear()}.${date.getMonth()}` }
                        </span>
                        <span className='rounded-sm bg-gray-300 py-0.5 text-[.75em] text-white text-center font-bold'>
                            <Translation label={`common.weekday.${date.getDay()}`} />
                        </span>
                    </div>
                    <div className='flex-1 justify-end flex gap-16 font-bold'>
                        { income > 0 && <MoneyComponent money={ income } /> }
                        <MoneyComponent money={ expense } />
                    </div>
                </div>
                { transactions[key].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     account={ account }
                                     transaction={ transaction } />) }
            </div>
        }) }

        { hasTransactions && <Paginator page={ parseInt(page) }
                                     records={ pagination?.records }
                                     pageSize={ pagination?.pageSize }/> }
    </>
}

export default TransactionList
