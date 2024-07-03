import { FC, useEffect, useState } from "react";

import { Account, Pagination, Transaction } from "../../core/types";
import { Range } from "../../core/Dates";
import AccountRepository from "../../core/repositories/account-repository";
import useQueryParam from "../../hooks/query-param.hook";
import MoneyComponent from "../format/money.component";
import TransactionItem from "../transaction/transaction-detail.component";
import { Paginator } from "../layout/paginator.component";
import { groupTransactionByYear, YearlyTransactions } from "../../core/reducers";

import Loading from "../layout/loading.component";

type LiabilityTransactionListProps = {
    account: Account,
    range: Range
}

const LiabilityTransactionList: FC<LiabilityTransactionListProps> = ({ account, range }) => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [transactions, setTransactions] = useState<YearlyTransactions>()
    const [pagination, setPagination] = useState<Pagination>()

    const showPagination = pagination && pagination?.records > pagination?.pageSize

    useEffect(() => {
        const correctedRange = range.shiftDays(1)

        setTransactions(undefined)
        AccountRepository.transactions(account.id, correctedRange, page)
            .then(result => {
                const transactions = result.content
                    .reduce(groupTransactionByYear, {})
                setTransactions(transactions)
                setPagination(result.info)
            })
            .catch(console.log)
    }, [ page, account, range ]);

    if (!transactions) return <Loading />
    return <>
        { transactions && Object.keys(transactions)
            .sort((l, r) => l.localeCompare(r))
            .reverse()
            .map(year =>
                <div className='flex flex-col' key={ year }>
                    <div className='border-b-[1px] pb-1 mb-1 flex'>
                        <h1 className='font-bold flex-1'>
                            { year }
                        </h1>
                        <span className='flex-1 text-right font-bold'>
                        <MoneyComponent
                            money={ transactions[year].reduce((accumulator: number, transaction: Transaction) => accumulator + transaction.amount, 0) }
                            currency={ account.account.currency }/>
                    </span>
                    </div>

                    { transactions[year].map(transaction =>
                        <TransactionItem key={ transaction.id }
                                         account={ account }
                                         transaction={ transaction }/>) }
                </div>) }

        { showPagination && <Paginator page={ parseInt(page) }
                   records={ pagination?.records }
                   pageSize={ pagination?.pageSize } /> }
    </>
}

export default LiabilityTransactionList