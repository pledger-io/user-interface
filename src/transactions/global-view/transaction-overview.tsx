import { useQueryParam } from "../../core/hooks";
import React, { FC, useEffect, useState } from "react";
import { Range } from "../../core/Dates";
import { TransactionRepository } from "../../core/RestAPI";
import { Pagination } from "../../core/types";
import TransactionFilters, { TransactionFilter } from "./transaction-filters";
import { Paginator } from "../../core/Paginator";
import { DailyTransactions, groupTransactionByDay } from "../../core/reducers";
import { Formats, Layout, Resolver, Translations } from "../../core";
import TransactionItem from "../transaction-item";

type TransactionOverviewProps = {
    range: Range,
    transfers: boolean
}

const TransactionOverview: FC<TransactionOverviewProps> = ({ range, transfers }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [searchCommand, setSearchCommand] = useState({})
    const [transactions, setTransactions] = useState<DailyTransactions | undefined>(undefined)
    const [pagination, setPagination] = useState<Pagination>()

    useEffect(() => {
        if (!(searchCommand as any).dateRange) return

        setTransactions(undefined)
        TransactionRepository.search(searchCommand)
            .then(response => {
                setTransactions((response.content || []).reduce(groupTransactionByDay, {}))
                setPagination(response.info)
            })
    }, [searchCommand])

    useEffect(() => {
        setSearchCommand(previous => {
            return {
                ...previous,
                dateRange: {
                    start: range.startString(),
                    end: range.endString()
                },
                page: parseInt(page),
                transfers: transfers
            }
        })
    }, [page, range, transfers])

    const onFilterChange = (filter: TransactionFilter) => setSearchCommand(oldValue => {
        return {
            ...oldValue,
            ...filter
        }
    })

    return <>
        { !transfers && <TransactionFilters onChange={ onFilterChange }/> }

        { !transactions && <Layout.Loading/> }

        { transactions && Object.keys(transactions).map(key => {
            const date = new Date(key)
            const expense = transactions[key]
                .filter(t => Resolver.Transaction.isCredit(t))
                .reduce((a, t) => a - t.amount, 0)
            const income = transactions[key]
                .filter(t => Resolver.Transaction.isDebit(t))
                .reduce((a, t) => a + t.amount, 0)

            return <div key={key} className='flex flex-col gap-0.5 pb-3'>
                <div className='flex gap-2 items-center border-b-[1px] pb-1 mb-1'>
                    <div className='font-bold text-lg[1.5em]'>
                        { date.getDate() }
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[.9em] text-neutral-500'>
                            { `${date.getFullYear()}.${date.getMonth()}` }
                        </span>
                        <span className='rounded bg-gray-300 py-0.5 text-[.75em] text-white text-center font-bold'>
                            <Translations.Translation label={`common.weekday.${date.getDay()}`} />
                        </span>
                    </div>
                    { !transfers && <>
                        <div className='flex-1 justify-end flex gap-16 font-bold'>
                            <Formats.Money money={ income } />
                            <Formats.Money money={ expense } />
                        </div>
                    </>}
                </div>
                { transactions[key].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     transaction={ transaction } />) }
            </div>
        })}

        { transactions && <Paginator page={ parseInt(page) }
                   records={ pagination?.records }
                   pageSize={ pagination?.pageSize }/> }
    </>
}

export default TransactionOverview