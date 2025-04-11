import React, { FC, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { i10n } from "../../config/prime-locale";
import { Resolver } from "../../core";
import { TransactionRepository } from "../../core/RestAPI";
import useQueryParam from "../../hooks/query-param.hook";
import { DailyTransactions, groupTransactionByDay } from "../../reducers";
import DateRange from "../../types/date-range.type";
import { Pagination } from "../../types/types";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import { Paginator } from "../layout/paginator.component";
import TransactionFilters, { TransactionFilter } from "./list-filters.component";
import TransactionItem from "./transaction-detail.component";

type TransactionOverviewProps = {
  range: DateRange,
  transfers: boolean
}

const TransactionOverview: FC<TransactionOverviewProps> = ({ range, transfers }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [searchCommand, setSearchCommand] = useState<TransactionFilter>(() => {
    const { searchCommand } = useRouteLoaderData(transfers ? 'transfers' : 'income-expense')
    return searchCommand
  })
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

  const isLoaded = transactions
  const hasTransactions = transactions && Object.keys(transactions).length > 0
  const showPagination = pagination && pagination?.records > pagination?.pageSize

  return <>
    { !transfers && <TransactionFilters onChange={ onFilterChange } activeFilter={ searchCommand }/> }

    { !isLoaded && <Loading/> }

    { hasTransactions && Object.keys(transactions).map(key => {
      const date = new Date(key)
      const expense = transactions[key]
        .filter(t => Resolver.Transaction.isCredit(t))
        .reduce((a, t) => a - t.amount, 0)
      const income = transactions[key]
        .filter(t => Resolver.Transaction.isDebit(t))
        .reduce((a, t) => a + t.amount, 0)

      return <div key={ key } className='flex flex-col gap-0.5 pb-3'>
        <div
          className='flex gap-2 items-center border-b-[1px] py-1 mb-1 px-2 md:rounded-lg bg-blue-300/10 md:bg-blue-200/20'>
          <div className='font-bold text-[1.25em] text-muted'>
            { date.getDate() }
          </div>
          <div className='rounded-sm bg-gray-300 text-[.75em] text-white text-center font-bold px-1 py-0.25'>
            { i10n(`common.weekday.${ date.getDay() }`) }
          </div>
          <span className='text-xs text-muted'>{ date.getFullYear() }.{ date.getMonth() }</span>
          { !transfers && <>
            <div className='flex-1 justify-end flex gap-16 font-bold'>
              { income !== 0 && <MoneyComponent money={ income }/> }
              { expense !== 0 && <MoneyComponent money={ expense }/> }
              { expense === 0 && <div/> }
            </div>
          </> }
        </div>
        { transactions[key].map(transaction =>
          <TransactionItem key={ transaction.id }
                           transaction={ transaction }/>) }
      </div>
    }) }

    { showPagination && <Paginator page={ parseInt(page) }
                                   records={ pagination?.records }
                                   pageSize={ pagination?.pageSize }/> }
  </>
}

export default TransactionOverview
