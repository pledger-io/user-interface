import { mdiChevronDown, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useEffect, useState } from "react";
import { i10n } from "../../config/prime-locale";
import AccountRepository from "../../core/repositories/account-repository";
import useQueryParam from "../../hooks/query-param.hook";
import { groupTransactionByYear, YearlyTransactions } from "../../reducers";
import DateRange from "../../types/date-range.type";
import { Account, Transaction } from "../../types/types";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import TransactionItem from "../transaction/transaction-detail.component";

type LiabilityTransactionListProps = {
  account: Account,
  range: DateRange
}

const LiabilityTransactionList: FC<LiabilityTransactionListProps> = ({ account, range }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [transactions, setTransactions] = useState<YearlyTransactions>()

  useEffect(() => {
    const correctedRange = range.shiftDays(1)

    setTransactions(undefined)
    AccountRepository.transactions(account.id, correctedRange, page)
      .then(result => {
        const transactions = (result.content || [])
          .reduce(groupTransactionByYear, {})
        setTransactions(transactions)
      })
      .catch(console.log)
  }, [page, account, range]);

  if (!transactions) return <Loading/>
  return <>
    { Object.keys(transactions).length === 0 && <div className='text-center text-gray-500'> { i10n('common.overview.noresults') }</div>}

    { transactions &&
      Object.keys(transactions)
      .sort((l, r) => l.localeCompare(r))
      .reverse()
      .map(year => <LiabilityYearOverview key={ year } account={ account } year={ year } transactions={ transactions[year] } />)
    }
  </>
}

const LiabilityYearOverview: FC<{ year: string, transactions: Transaction[], account: Account }> = ({ year, transactions, account }) => {
  const [collapsed, setCollapsed] = useState(() => year !== ('' + new Date().getFullYear()))

  const computedMaxHeight = (transactions.length * 7) + 'rem'
  const totalDeposit = transactions.reduce((accumulator: number, transaction: Transaction) => accumulator + transaction.amount, 0)
  return <div className='flex flex-col' key={ year }>
    <div className='border-b-[1px] pb-1 mb-1 flex bg-blue-200/50 bg-opacity-10 rounded-lg px-2'>
      <h1 className='font-bold flex-1 cursor-pointer flex' onClick={ () => setCollapsed(!collapsed) }>
        { !collapsed && <Icon path={ mdiChevronDown } size={ 1 } /> }
        { collapsed && <Icon path={ mdiChevronRight } size={ 1 } /> }
        { year }
      </h1>
      <span className='font-bold'>
        <MoneyComponent money={ totalDeposit } currency={ account.account.currency }/>
      </span>
    </div>

    <div style={ { maxHeight: collapsed ? '0' : computedMaxHeight } }
         className='overflow-hidden transition-[max-height] duration-500 ease-in-out'>
      { transactions.map(transaction =>
        <TransactionItem key={ transaction.id }
                         account={ account }
                         transaction={ transaction }/>) }
    </div>
  </div>
}

export default LiabilityTransactionList
