import {useQueryParam} from "../../core/hooks";
import React, {FC, useEffect, useState} from "react";
import {Range} from "../../core/Dates";
import {TransactionRepository} from "../../core/RestAPI";
import {Pagination, Transaction} from "../../core/types";
import TransactionFilters from "./transaction-filters";
import {TransactionTable} from "../table-view";
import {Paginator} from "../../core/Paginator";

type TransactionOverviewProps = {
    range: Range,
    transfers: boolean
}

const TransactionOverview: FC<TransactionOverviewProps> = ({ range, transfers }) => {
    const [page] = useQueryParam('page', "1")
    const [searchCommand, setSearchCommand] = useState({})
    const [transactions, setTransactions] = useState<Transaction[] | undefined>([])
    const [pagination, setPagination] = useState<Pagination>()

    useEffect(() => {
        if (!searchCommand.hasOwnProperty('dateRange')) return

        setTransactions(undefined)
        TransactionRepository.search(searchCommand)
            .then(response => {
                setTransactions(response.content)
                setPagination(response.info)
            })
    }, [searchCommand])
    useEffect(() => {
        setSearchCommand({transfers})
    }, [transfers])

    useEffect(() => {
        setSearchCommand(previous => {
            return {
                ...previous,
                dateRange: {
                    start: range.startString(),
                    end: range.endString()
                },
                page
            }
        })
    }, [page, range])

    const onFilterChange = (filter: any) => setSearchCommand(oldValue => {
        return {
            ...oldValue,
            ...filter
        }
    })

    return <>
        {!transfers && <TransactionFilters onChange={ onFilterChange }/>}

        <TransactionTable transactions={ transactions }/>

        <Paginator page={ parseInt(page) }
                   records={ pagination?.records }
                   pageSize={ pagination?.pageSize }/>
    </>
}

export default TransactionOverview