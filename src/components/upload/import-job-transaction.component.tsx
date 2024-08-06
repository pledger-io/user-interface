import React, { useEffect, useState } from "react";
import { Resolver } from "../../core";
import { groupTransactionByYear, YearlyTransactions } from "../../reducers";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { Pagination } from "../../types/types";
import useQueryParam from "../../hooks/query-param.hook";
import MoneyComponent from "../format/money.component";

import Loading from "../layout/loading.component";
import { Paginator } from "../layout/paginator.component";
import Translation from "../localization/translation.component";
import TransactionItem from "../transaction/transaction-detail.component";

const ImportJobTransactionComponent = ({ slug }: { slug: string }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [transactions, setTransactions] = useState<YearlyTransactions>()
    const [pagination, setPagination] = useState<Pagination>()

    useEffect(() => {
        setTransactions(undefined)
        ImportJobRepository.transactions(slug, parseInt(page))
            .then(result => {
                const transactions = (result.content || [])
                    .reduce(groupTransactionByYear, {})
                setTransactions(transactions)
                setPagination(result.info)
            })
            .catch(console.error)
    }, [page, slug]);

    const isLoaded = transactions
    const hasTransactions = transactions && Object.keys(transactions).length > 0
    const showPagination = pagination && pagination?.records > pagination?.pageSize

    return <>
        <h1 className='mt-5 mb-2 text-lg font-bold'>
            <Translation label='page.title.transactions.overview'/>
        </h1>
        { !isLoaded && <Loading/> }

        { isLoaded && !hasTransactions && <div className='text-center text-gray-500'>
            <Translation label='common.overview.noresults'/>
        </div> }

        { transactions && Object.keys(transactions).sort().reverse().map(year => {
            const expense = transactions[year]
                .filter(t => Resolver.Transaction.isCredit(t))
                .reduce((a, t) => a - t.amount, 0)
            const income = transactions[year]
                .filter(t => Resolver.Transaction.isDebit(t))
                .reduce((a, t) => a + t.amount, 0)

            return <div className='flex flex-col' key={ year }>
                <div className='border-b-[1px] pb-1 mb-1 flex'>
                    <h1 className='font-bold flex-1'>
                        { year }
                    </h1>
                    <span className='flex-1 justify-end flex gap-16 font-bold'>
                        { income !== 0 && <MoneyComponent money={ income }/> }
                        { expense !== 0 && <MoneyComponent money={ expense }/> }
                        { expense === 0 && <div/> }
                    </span>
                </div>

                { transactions[year].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     transaction={ transaction }/>) }
            </div>
        }) }

        { showPagination && <Paginator page={ parseInt(page) }
                                       records={ pagination?.records }
                                       pageSize={ pagination?.pageSize }/> }
    </>
}

export default ImportJobTransactionComponent