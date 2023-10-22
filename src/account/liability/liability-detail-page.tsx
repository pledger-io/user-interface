import React, {useEffect, useState} from 'react'
import {useQueryParam} from "../../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Charts,
    Dates,
    Formats,
    Layout,
    Pagination,
    Resolver,
    Statistical,
    Translations
} from "../../core";

import AccountRepository from "../../core/repositories/account-repository";
import {mdiCashPlus} from "@mdi/js";
import {useParams} from "react-router-dom";

import '../../assets/css/LiabiliryView.scss'
import {TransactionTable} from "../../transactions/table-view";
import {Account, ChartSeries, Transaction} from "../../core/types";
import {Range} from "../../core/Dates";
import LiabilityTransactionList from "./liability-transaction-list";

// const LiabilityTransactionComponent = ({account, range}) => {
//     const [page]                            = useQueryParam({key: 'page', initialValue: "1"})
//     const [transactions, setTransactions]   = useState()
//     const [pagination, setPagination]       = useState({})
//
//     useEffect(() => {
//         setTransactions(undefined)
//
//         const correctedRange = range.shiftDays(1)
//         AccountRepository.transactions(account.id, correctedRange, page)
//             .then(result => setTransactions(result.content) || setPagination(result.info))
//     }, [page, range, account])
//
//     return <>
//         <TransactionTable account={account} transactions={transactions}/>
//
//         <Pagination.Paginator page={parseInt(page)} records={pagination.records}
//                               pageSize={pagination.pageSize} />
//     </>
// }

const LiabilityDetailView = () => {
    const [account, setAccount] = useState<Account>()
    const [openingTransaction, setOpeningTransaction] = useState<Transaction>()
    const [range, setRange] = useState<Range>()
    const [balanceSeries, setBalanceSeries] = useState<ChartSeries[]>()

    const {id}     = useParams()

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
        AccountRepository.firstTransaction(id, 'Opening balance')
            .then(setOpeningTransaction)
    }, [id])

    useEffect(() => {
        if (account)
            setRange(Dates.Ranges.forRange(
                account.history.firstTransaction,
                account.history.lastTransaction))
    }, [account])

    useEffect(() => {
        if (account && range) {
            Charts.SeriesProvider.balanceSeries({
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: true,
                accounts: [account]
            }).then(result => setBalanceSeries([ result ]))
        }
    }, [range, account])


    if (!account || !range) return <Layout.Loading />
    return (
        <div>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability' href='/accounts/liability'/>
                <BreadCrumbItem message={ account.name }/>
                <BreadCrumbItem label='page.nav.transactions'/>
            </BreadCrumbs>

            <div className="flex gap-2">
                <Layout.Card className='flex-1'>
                    <h1 className='font-bold'>{ account.name }</h1>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translations.Translation label='Account.interest'/>:</label>
                        <span className='flex-1'><Formats.Percent percentage={ account.interest?.interest }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translations.Translation label='Account.interestPeriodicity'/>:</label>
                        <span className='flex-1'><Translations.Translation label={ `Periodicity.${account.interest?.periodicity}` }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'>
                            <Translations.Translation label='page.accounts.liability.startBalance'/>:
                        </label>
                        <span className='flex-1 [&>*]:!text-warning'>
                            <Formats.Money money={ openingTransaction?.amount } currency={ account.account.currency } />
                        </span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translations.Translation label='page.accounts.liability.paid'/>:</label>
                        <span className='flex-1'>
                            <Statistical.Balance accounts={ [{id: account.id}] }
                                                 income={ true }
                                                 currency={ account.account.currency }/>
                        </span>
                    </div>
                </Layout.Card>
                <Layout.Card className='flex-[2]'>
                    <h1>
                        <Translations.Translation label='common.account.balance'/>
                    </h1>
                    <h4>
                        <Translations.Translation label={ `common.month.${range.start?.getMonth() + 1}` } />
                        { range.start?.getFullYear() }
                        -
                        <Translations.Translation label={ `common.month.${range.end?.getMonth() + 1}` } />
                        {range.end?.getFullYear()}
                    </h4>

                    <Charts.Chart height={ 250 }
                                  id='liability-balance-graph'
                                  dataSets={balanceSeries} />
                </Layout.Card>
            </div>

            <Layout.Card title='page.title.transactions.overview'>
                <Buttons.Button label='page.account.liability.payment.add'
                                href={`${Resolver.Account.resolveUrl(account)}/transactions/add`}
                                variant='success'
                                className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                icon={mdiCashPlus}/>

                <LiabilityTransactionList account={ account } range={ range } />
            </Layout.Card>
        </div>
    )
}

export default LiabilityDetailView
