import React, {useEffect, useState} from 'react'
import {useQueryParam} from "../../core/hooks";
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Charts,
    Dates,
    Formats,
    Loading,
    Pagination,
    Resolver,
    Statistical,
    Translations
} from "../../core";

import '../../assets/css/LiabiliryView.scss'
import {AccountRepository} from "../../core/RestAPI";
import {TransactionTable} from "../../transactions/TransactionTable";
import {mdiCashPlus} from "@mdi/js";
import {useParams} from "react-router-dom";

const LiabilityView = () => {
    const [account, setAccount]                       = useState()
    const [openingTransaction, setOpeningTransaction] = useState({})
    const [transactions, setTransactions]             = useState()
    const [pagination, setPagination]                 = useState({})
    const [range, setRange]                           = useState(Dates.Ranges.currentMonth())
    const [balanceSeries, setBalanceSeries]           = useState([])

    const {id}     = useParams()
    const [page]   = useQueryParam('page', "1")

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
        AccountRepository.firstTransaction(id, 'Opening balance')
            .then(setOpeningTransaction)
    }, [id])
    useEffect(() => {
        setRange(Dates.Ranges.forRange(
            account?.history?.firstTransaction,
            account?.history?.lastTransaction))
    }, [account])
    useEffect(() => {
        if (account)
            Charts.SeriesProvider.balanceSeries({
                id: 'balance-series',
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: true,
                accounts: [account]
            }).then(result => setBalanceSeries([result]))
    }, [range, account])
    useEffect(() => {
        if (account)
            AccountRepository.transactions(account.id, range, page)
                .then(result => setTransactions(result.content) || setPagination(result.info))
    }, [page, range, account])

    if (!account || !range) return <Loading />
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
                <Card>
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
                </Card>
                <Card>
                    <h1><Translations.Translation label='common.account.balance'/></h1>
                    <h4>
                        <Translations.Translation label={`common.month.${range.start?.getMonth() + 1}`} /> {range.start?.getFullYear()}
                        -
                        <Translations.Translation label={`common.month.${range.end?.getMonth() + 1}`} /> {range.end?.getFullYear()}
                    </h4>

                    <Charts.Chart height={100}
                                  id='liability-balance-graph'
                                  dataSets={balanceSeries} />
                </Card>
            </div>

            <Card title='page.title.transactions.overview'>
                <Buttons.Button label='page.account.liability.payment.add'
                                href={`${Resolver.Account.resolveUrl(account)}/transactions/add`}
                                variant='success'
                                className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                icon={mdiCashPlus}/>

                <TransactionTable account={account} transactions={transactions}/>

                <Pagination.Paginator page={parseInt(page)} records={transactions}
                                      pageSize={pagination.pageSize} />
            </Card>
        </div>
    )
}

export default LiabilityView
