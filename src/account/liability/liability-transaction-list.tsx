import {FC, useEffect, useState} from "react";

import {Account, Pagination, Transaction} from "../../core/types";
import {Range} from "../../core/Dates";
import AccountRepository from "../../core/repositories/account-repository";
import {useQueryParam} from "../../core/hooks";
import {Formats, Layout} from "../../core";
import TransactionItem from "../../transactions/transaction-item";
import {Paginator} from "../../core/Paginator";
import {groupTransactionByYear, YearlyTransactions} from "../../core/reducers";

type LiabilityTransactionListProps = {
    account: Account,
    range: Range
}

const LiabilityTransactionList: FC<LiabilityTransactionListProps> = ({ account, range }) => {
    const [page] = useQueryParam({key: 'page', initialValue: "1"})
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

    if (!transactions) return <Layout.Loading />
    return <>
        { transactions && Object.keys(transactions).sort().reverse().map(year => <>
            <div className='flex flex-col'>
                <div className='border-b-[1px] pb-1 mb-1 flex'>
                    <h1 className='font-bold flex-1'>
                        { year }
                    </h1>
                    <span className='flex-1 text-right font-bold'>
                        <Formats.Money money={ transactions[year].reduce((accumulator: number, transaction: Transaction) => accumulator + transaction.amount, 0) }
                                       currency={ account.account.currency }/>
                    </span>
                </div>

                { transactions[year].map(transaction =>
                    <TransactionItem key={ transaction.id }
                                     account={ account }
                                     transaction={ transaction }/>)}
            </div>
        </>) }

        { showPagination && <Paginator page={ parseInt(page) }
                   records={ pagination?.records }
                   pageSize={ pagination?.pageSize } /> }
    </>
}

export default LiabilityTransactionList