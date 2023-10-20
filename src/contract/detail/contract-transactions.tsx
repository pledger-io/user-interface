import {Contract, Transaction, Pagination as PaginationType} from "../../core/types";
import React, {FC, useEffect, useState} from "react";
import {TransactionTable} from "../../transactions/table-view";
import {useQueryParam} from "../../core/hooks";
import {Layout, Pagination} from "../../core";
import ContractRepository from "../../core/repositories/contract-repository";

type ContractTransactionsProps = {
    contract: Contract
}

const ContractTransactions: FC<ContractTransactionsProps> = ({ contract }) => {
    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({} as PaginationType)
    const [page] = useQueryParam({key: 'page', initialValue: "1"})

    useEffect(() => {
        setTransactions(undefined)
        ContractRepository.transactions(contract.id, parseInt(page) - 1)
            .then(({content, info}) => {
                setTransactions(content)
                setPagination(info)
            })
            .catch(console.error)
    }, [contract, page]);

    return <>
        <Layout.Loading condition={ transactions !== undefined }>
            { transactions && <TransactionTable transactions={ transactions } /> }

            <Pagination.Paginator page={ parseInt(page) }
                                  records={ pagination.records }
                                  pageSize={ pagination.pageSize }/>
        </Layout.Loading>
    </>
}

export default ContractTransactions