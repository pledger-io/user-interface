import { useQueryParam } from "../../core/hooks";
import React, { useEffect, useState } from "react";
import { groupTransactionByYear, YearlyTransactions } from "../../core/reducers";
import { Pagination } from "../../core/types";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { Formats, Layout, Resolver, Translations } from "../../core";
import TransactionItem from "../../transactions/transaction-item";
import { Paginator } from "../../core/Paginator";

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
    }, [ page, slug ]);

    const isLoaded = transactions
    const hasTransactions = transactions && Object.keys(transactions).length > 0
    const showPagination = pagination && pagination?.records > pagination?.pageSize

    return <>
        <h1 className='mt-5 mb-2 text-lg font-bold'>
            <Translations.Translation label='page.title.transactions.overview' />
        </h1>
        { !isLoaded && <Layout.Loading/> }

        { isLoaded && !hasTransactions && <div className='text-center text-gray-500'>
            <Translations.Translation label='common.overview.noresults' />
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
                        { income !== 0 && <Formats.Money money={ income } /> }
                        { expense !== 0 && <Formats.Money money={ expense } /> }
                        { expense === 0 && <div/> }
                    </span>
                </div>

                { transactions[year].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     transaction={ transaction }/>) }
            </div>
        } ) }

        { showPagination && <Paginator page={ parseInt(page) }
                                       records={ pagination?.records }
                                       pageSize={ pagination?.pageSize }/> }
    </>
}

export default ImportJobTransactionComponent