import { Paginator } from "primereact/paginator";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { groupTransactionByYear, YearlyTransactions } from "../../reducers";
import ContractRepository from "../../core/repositories/contract-repository";
import { Contract, Pagination as PaginationType, Transaction } from "../../types/types";
import useQueryParam from "../../hooks/query-param.hook";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import TransactionItem from "../transaction/transaction-detail.component";

type ContractTransactionsProps = {
  contract: Contract
}

const ContractTransactions: FC<ContractTransactionsProps> = ({ contract }) => {
  const [transactions, setTransactions] = useState<YearlyTransactions | undefined>(undefined)
  const [pagination, setPagination] = useState<PaginationType>({} as PaginationType)
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const navigate  = useNavigate()

  useEffect(() => {
    setTransactions(undefined)
    ContractRepository.transactions(contract.id, parseInt(page) - 1)
      .then(({ content, info }) => {
        setTransactions((content || []).reduce(groupTransactionByYear, {}))
        setPagination(info)
      })
      .catch(console.error)
  }, [contract, page]);

  const showPagination = pagination && pagination?.records > pagination?.pageSize
  if (!transactions) return <Loading/>
  return <>
    { transactions && Object.keys(transactions).sort().reverse().map(year =>
      <div className='flex flex-col' key={ year }>
        <div className='border-b-[1px] pb-1 mb-1 flex'>
          <h1 className='font-bold flex-1'>
            { year }
          </h1>
          <span className='flex-1 text-right font-bold'>
                        <MoneyComponent
                          money={ transactions[year].reduce((accumulator: number, transaction: Transaction) => accumulator - transaction.amount, 0) } />
                    </span>
        </div>

        { transactions[year].map(transaction =>
          <TransactionItem key={ transaction.id }
                           account={ contract.company }
                           transaction={ transaction }/>) }
      </div>
    ) }

    { showPagination &&
      <Paginator totalRecords={ pagination.records }
                 rows={ pagination.pageSize }
                 first={ (parseInt(page) - 1) * pagination.pageSize }
                 onPageChange={ (e) => navigate(`?page=${ e.page + 1 }`) }/> }
  </>
}

export default ContractTransactions
