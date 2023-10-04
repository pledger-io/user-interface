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

const LiabilityTransactionComponent = ({account, range}) => {
    const [page]                            = useQueryParam('page', "1")
    const [transactions, setTransactions]   = useState()
    const [pagination, setPagination]       = useState({})

    useEffect(() => {
        setTransactions(undefined)

        const correctedRange = range.shiftDays(1)
        AccountRepository.transactions(account.id, correctedRange, page)
            .then(result => setTransactions(result.content) || setPagination(result.info))
    }, [page, range, account])

    return <>
        <TransactionTable account={account} transactions={transactions}/>

        <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                              pageSize={pagination.pageSize} />
    </>
}

const LiabilityView = () => {
    const [account, setAccount]                       = useState()
    const [openingTransaction, setOpeningTransaction] = useState({})
    const [range, setRange]                           = useState()
    const [balanceSeries, setBalanceSeries]           = useState([])

    const {id}     = useParams()

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
        AccountRepository.firstTransaction(id, 'Opening balance')
            .then(setOpeningTransaction)
    }, [id])
    useEffect(() => {
        if (account) setRange(Dates.Ranges.forRange(account.history.firstTransaction, account.history.lastTransaction))
    }, [account])
    useEffect(() => {
        if (account && range)
            Charts.SeriesProvider.balanceSeries({
                id: 'balance-series',
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: true,
                accounts: [account]
            }).then(result => setBalanceSeries([result]))
    }, [range, account])


    if (!account || !range) return <Layout.Loading />
    return (
        <div className="LiabilityView">
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability' href='/accounts/liability'/>
                <BreadCrumbItem message={account.name}/>
                <BreadCrumbItem label='page.nav.transactions'/>
            </BreadCrumbs>

            <div className="Summary">
                <Layout.Card>
                    <h1>{account.name}</h1>
                    <div className="Details">
                        <label><Translations.Translation label='Account.interest'/></label>
                        <Formats.Percent percentage={account.interest?.interest}/>
                    </div>
                    <div className="Details">
                        <label><Translations.Translation label='Account.interestPeriodicity'/></label>
                        <Translations.Translation label={`Periodicity.${account.interest?.periodicity}`}/>
                    </div>
                    <div className="Details OpenBalance">
                        <label><Translations.Translation label='page.accounts.liability.startBalance'/></label>
                        <Formats.Money money={openingTransaction.amount} currency={account.currency} />
                    </div>
                    <div className="Details">
                        <label><Translations.Translation label='page.accounts.liability.paid'/></label>
                        <Statistical.Balance accounts={[account]} income={true}/>
                    </div>
                </Layout.Card>
                <Layout.Card>
                    <h1><Translations.Translation label='common.account.balance'/></h1>
                    <h4>
                        <Translations.Translation label={`common.month.${range.start?.getMonth() + 1}`} /> {range.start?.getFullYear()}
                        -
                        <Translations.Translation label={`common.month.${range.end?.getMonth() + 1}`} /> {range.end?.getFullYear()}
                    </h4>

                    <Charts.Chart height={100}
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
                <LiabilityTransactionComponent range={range} account={account} />
            </Layout.Card>
        </div>
    )
}

export default LiabilityView
