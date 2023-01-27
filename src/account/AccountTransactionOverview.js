import React, {useEffect, useState} from "react";
import {mdiCartPlus, mdiCashPlus, mdiSwapHorizontal} from "@mdi/js";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Card,
    Charts,
    Dates,
    Dropdown, Loading,
    Pagination,
    Resolver,
} from "../core";
import {TransactionTable} from "../transactions/TransactionTable";

import '../assets/css/TransactionOverview.scss'
import {useNavigate, useParams} from "react-router-dom";
import {AccountRepository} from "../core/RestAPI";
import {useQueryParam} from "../core/hooks";

const TYPE_MAPPING = {
    expense: 'creditor',
    revenue: 'debtor',
    own: 'accounts'
}

const AccountTransactionOverview = () => {
    const navigate                           = useNavigate()
    const {id, type, year, month}            = useParams()
    const [account, setAccount]              = useState({})
    const [page]                             = useQueryParam('page', "1")
    const [transactions, setTransactions]    = useState(undefined)
    const [pagination, setPagination]        = useState({})
    const [balanceSeries, setBalanceSeries]  = useState(undefined)
    const [range, setRange]                  = useState(Dates.Ranges.currentMonth())

    const onDateChange = ({year, month}) => navigate(`/accounts/${type}/${id}/transactions/${year}/${month}`)

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
    }, [id])
    useEffect(() => {
        if (year && month) setRange(Dates.Ranges.forMonth(year, month))
    }, [year, month])

    useEffect(() => {
        setTransactions(undefined)
        AccountRepository.transactions(id, range, parseInt(page))
            .then(results => setTransactions(results.content) || setPagination(results.info))
    }, [id, range, page])
    useEffect(() => {
        setBalanceSeries(undefined)
        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true,
            accounts: [account]
        }).then(result => setBalanceSeries([result]))
    }, [id, range, account])

    return (
        <div className='TransactionOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings' />
                <BreadCrumbItem label='page.nav.accounts' />
                <BreadCrumbItem label={`page.nav.accounts.${TYPE_MAPPING[type]}`} />
                <BreadCrumbItem message={account.name} />

                <BreadCrumbMenu>
                    <Dropdown.YearMonth
                        onChange={onDateChange}
                        selected={{month: range.month(), year: range.year()}} />
                </BreadCrumbMenu>
            </BreadCrumbs>

            <Card title='common.account.balance'>
                <Loading condition={balanceSeries}>
                    <Charts.Chart height={75}
                                  id='dashboard-balance-graph'
                                  dataSets={balanceSeries || []}>
                    </Charts.Chart>
                </Loading>
            </Card>

            <Card title='page.title.transactions.overview'>
                <div className="BalanceButtons">
                    <Buttons.Button label='page.transactions.debit.add'
                                    href={`${Resolver.Account.resolveUrl(account)}/transactions/add/debit`}
                                    variant='success'
                                    className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                    icon={mdiCashPlus}/>
                    <Buttons.Button label='page.transactions.credit.add'
                                    href={`${Resolver.Account.resolveUrl(account)}/transactions/add/credit`}
                                    className={Resolver.Account.isCreditor(account) ? 'Hidden' : ''}
                                    variant='warning'
                                    icon={mdiCartPlus}/>
                    <Buttons.Button label='page.transactions.transfer.add'
                                    href={`${Resolver.Account.resolveUrl(account)}/transactions/add/transfer`}
                                    className={Resolver.Account.isManaged(account) ? 'Hidden' : ''}
                                    variant='primary'
                                    icon={mdiSwapHorizontal}/>
                </div>

                <TransactionTable account={account} transactions={transactions}/>

                <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                                      pageSize={pagination.pageSize}/>
            </Card>
        </div>
    )
}

export default AccountTransactionOverview
