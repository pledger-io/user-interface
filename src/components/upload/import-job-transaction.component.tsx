import { mdiRadar } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { Resolver } from "../../core";
import { groupTransactionByYear, YearlyTransactions } from "../../reducers";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { Pagination } from "../../types/types";
import useQueryParam from "../../hooks/query-param.hook";
import MoneyComponent from "../format/money.component";
import { Button } from "../layout/button";
import Loading from "../layout/loading.component";
import TransactionItem from "../transaction/transaction-detail.component";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";

const ImportJobTransactionComponent = ({ slug }: { slug: string }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [transactions, setTransactions] = useState<YearlyTransactions>()
  const [pagination, setPagination] = useState<Pagination>()
  const navigate = useNavigate()

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

  return <>
    <h1 className='mt-5 mb-2 text-lg font-bold'>
      { i10n('page.title.transactions.overview') }
    </h1>

    <div className='flex justify-end mb-4'>
      <Button onClick={ () => ImportJobRepository.runTransactionRules(slug) }
              className='mb-2'
              severity='info'
              size='small'
              icon={ mdiRadar }
              label='page.settings.import.details.transactions.rules.run'/>
    </div>

    { !isLoaded && <Loading/> }

    { isLoaded && !hasTransactions && <div className='text-center text-gray-500'>
      { i10n('common.overview.noresults') }
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

    { (pagination?.records || 0) > 0
      && <Paginator totalRecords={ pagination?.records }
                    rows={ pagination?.pageSize }
                    first={ (parseInt(page) - 1) * (pagination?.pageSize || 0) }
                    onPageChange={ event => navigate('?page=' + (event.page + 1)) }/> }
  </>
}

export default ImportJobTransactionComponent
