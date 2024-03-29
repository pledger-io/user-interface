import { Contract, Pagination as PaginationType, Transaction } from "../../core/types";
import React, { FC, useEffect, useState } from "react";
import { useQueryParam } from "../../core/hooks";
import { Formats, Layout, Pagination } from "../../core";
import ContractRepository from "../../core/repositories/contract-repository";
import { groupTransactionByYear, YearlyTransactions } from "../../core/reducers";
import TransactionItem from "../../transactions/transaction-item";

type ContractTransactionsProps = {
    contract: Contract
}

const ContractTransactions: FC<ContractTransactionsProps> = ({ contract }) => {
    const [transactions, setTransactions] = useState<YearlyTransactions | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({} as PaginationType)
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })

    useEffect(() => {
        setTransactions(undefined)
        ContractRepository.transactions(contract.id, parseInt(page) - 1)
            .then(({ content, info }) => {
                setTransactions(content.reduce(groupTransactionByYear, {}))
                setPagination(info)
            })
            .catch(console.error)
    }, [contract, page]);

    const showPagination = pagination && pagination?.records > pagination?.pageSize
    if (!transactions) return <Layout.Loading />
    return <>
        { transactions && Object.keys(transactions).sort().reverse().map(year =>
            <div className='flex flex-col' key={ year }>
                <div className='border-b-[1px] pb-1 mb-1 flex'>
                    <h1 className='font-bold flex-1'>
                        { year }
                    </h1>
                    <span className='flex-1 text-right font-bold'>
                        <Formats.Money money={ transactions[year].reduce((accumulator: number, transaction: Transaction) => accumulator - transaction.amount, 0) }
                                       currency={ contract.company.account.currency }/>
                    </span>
                </div>

                { transactions[year].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     account={ contract.company }
                                     transaction={ transaction }/>)}
            </div>
        ) }

        { showPagination && <Pagination.Paginator page={ parseInt(page) }
                              records={ pagination.records }
                              pageSize={ pagination.pageSize }/> }
    </>
}

export default ContractTransactions