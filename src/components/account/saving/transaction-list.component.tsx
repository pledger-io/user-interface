import { mdiChevronDown, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useEffect, useState } from "react";
import AccountRepository from "../../../core/repositories/account-repository";
import useQueryParam from "../../../hooks/query-param.hook";
import { groupTransactionByYear, YearlyTransactions } from "../../../reducers";
import DateRangeService from "../../../service/date-range.service";
import { Account, Transaction } from "../../../types/types";
import MoneyComponent from "../../format/money.component";
import Loading from "../../layout/loading.component";
import Translation from "../../localization/translation.component";
import TransactionItem from "../../transaction/transaction-detail.component";

const TransactionListComponent = ({ account }: { account: Account }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [transactions, setTransactions] = useState<YearlyTransactions>()

  useEffect(() => {
    if (!account.history.firstTransaction || !account.history.lastTransaction) {
      setTransactions({})
      return
    }

    setTransactions(undefined)
    const range = DateRangeService.forRange(account.history.firstTransaction, account.history.lastTransaction)
    AccountRepository.transactions(account.id, range, page)
      .then(result => {
        const transactions = (result.content || [])
          .reduce(groupTransactionByYear, {})
        setTransactions(transactions)
      })
      .catch(console.log)
  }, [page, account]);

  const isLoaded = transactions
  const hasTransactions = transactions && Object.keys(transactions).length > 0
  return <>
    { !isLoaded && <Loading/> }

    { isLoaded && !hasTransactions &&
      <div className='text-center text-gray-500'>
        <Translation label='common.overview.noresults'/>
      </div>
    }

    { hasTransactions && Object.keys(transactions)
      .sort((l, r) => l.localeCompare(r))
      .reverse()
      .map(year => <SavingYearOverview key={ year } account={ account } year={ year }
                                       transactions={ transactions[year] }/>) }
  </>
}

const SavingYearOverview: FC<{ year: string, transactions: Transaction[], account: Account }>
  = ({ year, account, transactions }) => {
  const [collapsed, setCollapsed] = useState(() => year !== ('' + new Date().getFullYear()))

  const computedMaxHeight = (transactions.length * 7) + 'rem'
  const expense = transactions.filter(t => t.source.id == account.id).reduce((a, t) => a + t.amount, 0)
  const income = transactions.filter(t => t.destination.id == account.id).reduce((a, t) => a + t.amount, 0)

  return <>
    <div className='flex flex-col' key={ year }>
      <div className='border-b-[1px] pb-1 mb-1 flex'>
        <h1 className='font-bold flex-1 cursor-pointer flex' onClick={ () => setCollapsed(!collapsed) }>
          <a className='cursor-pointer' onClick={ () => setCollapsed(!collapsed) }>
            { !collapsed && <Icon path={ mdiChevronDown } size={ 1 } /> }
            { collapsed && <Icon path={ mdiChevronRight } size={ 1 } /> }
          </a>
          { year }
        </h1>
        <span className='font-bold'>
          <MoneyComponent money={ income - expense } currency={ account.account.currency }/>
        </span>
      </div>

      <div style={ { maxHeight: collapsed ? '0' : computedMaxHeight } }
           className='overflow-hidden transition-[max-height] duration-500 ease-in-out'>
        {
          transactions.map(transaction =>
            <TransactionItem key={ transaction.id }
                             account={ account }
                             transaction={ transaction }/>)
        }
      </div>
    </div>
  </>
}

export default TransactionListComponent
