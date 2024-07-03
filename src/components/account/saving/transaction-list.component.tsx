import React, { useEffect, useState } from "react";
import { Dates } from "../../../core";
import { groupTransactionByYear, YearlyTransactions } from "../../../core/reducers";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account, Pagination as PaginationType, Transaction } from "../../../core/types";
import useQueryParam from "../../../hooks/query-param.hook";
import MoneyComponent from "../../format/money.component";

import Loading from "../../layout/loading.component";
import { Paginator } from "../../layout/paginator.component";
import Translation from "../../localization/translation.component";
import TransactionItem from "../../transaction/transaction-detail.component";

const TransactionListComponent = ({ account }: { account: Account }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [transactions, setTransactions] = useState<YearlyTransactions>()
    const [pagination, setPagination] = useState<PaginationType>()

    useEffect(() => {
        if (!account.history.firstTransaction || !account.history.lastTransaction) {
            setTransactions({})
            return
        }

        setTransactions(undefined)
        const range = Dates.Ranges.forRange(account.history.firstTransaction, account.history.lastTransaction)
        AccountRepository.transactions(account.id, range, page)
            .then(result => {
                const transactions = (result.content || [])
                    .reduce(groupTransactionByYear, {})
                setTransactions(transactions)
                setPagination(result.info)
            })
            .catch(console.log)
    }, [page, account]);

    const isLoaded = transactions
    const hasTransactions = transactions && Object.keys(transactions).length > 0
    const showPagination = pagination && pagination?.records > pagination?.pageSize
    return <>
        { !isLoaded && <Loading/> }

        { isLoaded && !hasTransactions &&
            <div className='text-center text-gray-500'>
                <Translation label='common.overview.noresults'/>
            </div>
        }

        { hasTransactions && Object.keys(transactions).map(year => {
            return <div className='flex flex-col' key={ year }>
                <div className='border-b-[1px] pb-1 mb-1 flex'>
                    <h1 className='font-bold flex-1'>
                        { year }
                    </h1>
                    <span className='flex-1 text-right font-bold'>
                        <MoneyComponent
                            money={ transactions[year].reduce((accumulator: number, transaction: Transaction) => accumulator - transaction.amount, 0) }
                            currency={ account.account.currency }/>
                    </span>
                </div>

                { transactions[year].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     account={ account }
                                     transaction={ transaction }/>)
                }
            </div>
        }) }

        { showPagination && <Paginator page={ parseInt(page) }
                                       records={ pagination?.records }
                                       pageSize={ pagination?.pageSize }/> }
    </>
}

export default TransactionListComponent