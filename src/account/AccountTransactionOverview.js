import React, {useEffect, useState} from "react";
import {mdiCartPlus, mdiCashPlus, mdiSwapHorizontal} from "@mdi/js";
import {
    BreadCrumbItem,
    BreadCrumbMenu,
    BreadCrumbs,
    Buttons,
    Charts,
    Dates,
    Dropdown,
    Layout,
    Loading,
    Pagination,
    Resolver,
} from "../core";
import {TransactionTable} from "../transactions/TransactionTable";

import '../assets/css/TransactionOverview.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useQueryParam} from "../core/hooks";
import AccountRepository from "../core/repositories/account-repository";

const TYPE_MAPPING = {
    expense: 'creditor',
    revenue: 'debtor',
    own: 'accounts'
}

const AccountTransactionComponent = ({account, range}) => {
    const [transactions, setTransactions]    = useState(undefined)
    const [pagination, setPagination]        = useState({})
    const [page]                             = useQueryParam('page', "1")

    useEffect(() => {
        setTransactions(undefined)
        AccountRepository.transactions(account.id, range, parseInt(page))
            .then(results => setTransactions(results.content) || setPagination(results.info))
    }, [account, range, page])

    return <>
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
    </>
}

const AccountTransactionOverview = () => {
    const navigate                           = useNavigate()
    const {id, type, year, month}            = useParams()
    const [account, setAccount]              = useState({})
    const [range, setRange]                  = useState(Dates.Ranges.currentMonth())

    const onDateChange = ({year, month}) => navigate(`/accounts/${type}/${id}/transactions/${year}/${month}`)

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
    }, [id])
    useEffect(() => {
        if (year && month) setRange(Dates.Ranges.forMonth(year, month))
    }, [year, month])

    if (!account.hasOwnProperty('id')) return <Loading />
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

            <Layout.Card title='common.account.balance'>
                <Charts.BalanceChart id='dashboard-balance-graph'
                                     accounts={account}
                                     range={range}
                                     allMoney={true}/>
            </Layout.Card>

            {!Resolver.Account.isManaged(account) && <>
                <Layout.Grid type='column' minWidth='35em'>
                    <Layout.Card title='page.transactions.expense.category'>
                        <Charts.CategorizedPieChart id='category-expenses'
                                                    range={range}
                                                    incomeOnly={false}
                                                    accounts={account}
                                                    split='category'/>
                    </Layout.Card>
                    <Layout.Card title='page.transactions.expense.budget'>
                        <Charts.CategorizedPieChart id='budget-expenses'
                                                    range={range}
                                                    incomeOnly={false}
                                                    accounts={account}
                                                    split='budget'/>
                    </Layout.Card>
                    <Layout.Card title='page.transactions.income.category'>
                        <Charts.CategorizedPieChart id='category-income'
                                                    range={range}
                                                    incomeOnly={true}
                                                    accounts={account}
                                                    split='category'/>
                    </Layout.Card>
                </Layout.Grid>
            </>}

            <Layout.Card title='page.title.transactions.overview'>
                <AccountTransactionComponent account={account} range={range} />
            </Layout.Card>
        </div>
    )
}

export default AccountTransactionOverview
