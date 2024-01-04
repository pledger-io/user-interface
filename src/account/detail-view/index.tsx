import React, { FC, useEffect, useState } from "react";
import { BreadCrumbItem, BreadCrumbMenu, BreadCrumbs, Buttons, Dates, Dropdown, Layout, Resolver } from "../../core";
import { Account } from "../../core/types";
import { useNavigate, useParams } from "react-router-dom";
import AccountRepository from "../../core/repositories/account-repository";
import TransactionList from "./transaction-list";
import CategorizedPieChart from "../../core/graphs/categorized-pie-chart";
import BalanceChart from "../../core/graphs/balance-chart";
import { mdiCartPlus, mdiCashPlus, mdiSwapHorizontal } from "@mdi/js";

const TYPE_MAPPING = {
    expense: 'creditor',
    revenue: 'debtor',
    own: 'accounts'
}

type AccountType = keyof typeof TYPE_MAPPING

const AccountDetailView: FC = () => {
    const [account, setAccount] = useState<Account | undefined>(undefined)
    const [range, setRange] = useState(Dates.Ranges.currentMonth())
    const { id, type, year, month } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        AccountRepository.get(id)
            .then(setAccount)
    }, [id])
    useEffect(() => {
        if (year && month) setRange(Dates.Ranges.forMonth(year, month))
    }, [year, month])

    const isOwnType = type === 'own'
    const onDateChange = ({ year, month } : { month: number, year: number }) =>
        navigate(`/accounts/${type}/${id}/transactions/${year}/${month}`)

    const maxDate = Dates.Ranges.currentMonth().shiftDays(300).start
    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            { type && <BreadCrumbItem label={`page.nav.accounts.${TYPE_MAPPING[type as AccountType]}`}/> }
            <BreadCrumbItem message={account?.name}/>

            <BreadCrumbMenu>
                <Dropdown.YearMonth
                    onChange={ onDateChange }
                    minDate={ account?.history?.firstTransaction ? new Date(account.history.firstTransaction) : new Date() }
                    maxDate={ maxDate }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        { isOwnType && <>
            <Layout.Card title='common.account.balance'>
                <BalanceChart id='dashboard-balance-graph'
                                     accounts={ account }
                                     allMoney={ true }/>
            </Layout.Card>

            <Layout.Grid type='column' minWidth='20em'>
                <Layout.Card title='page.transactions.expense.category'>
                    <CategorizedPieChart id='category-expenses'
                                                incomeOnly={ false }
                                                accounts={ account }
                                                split='category'/>
                </Layout.Card>
                <Layout.Card title='page.transactions.expense.budget'>
                    <CategorizedPieChart id='budget-expenses'
                                                incomeOnly={ false }
                                                accounts={ account }
                                                split='budget'/>
                </Layout.Card>
                <Layout.Card title='page.transactions.income.category'>
                    <CategorizedPieChart id='category-income'
                                                incomeOnly={ true }
                                                accounts={ account }
                                                split='category'/>
                </Layout.Card>
            </Layout.Grid>
        </> }

        <Layout.Card title='page.title.transactions.overview'>
            { account && <Buttons.ButtonBar className='pb-2'>
                { (!Resolver.Account.isManaged(account) || Resolver.Account.isCreditor(account))
                    && <Buttons.Button label='page.transactions.debit.add'
                                       href={ `${Resolver.Account.resolveUrl(account)}/transactions/add/debit`}
                                       variant='success'
                                       className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                       icon={mdiCashPlus}/> }
                { (!Resolver.Account.isManaged(account) || Resolver.Account.isDebtor(account))
                    && <Buttons.Button label='page.transactions.credit.add'
                                href={`${Resolver.Account.resolveUrl(account)}/transactions/add/credit`}
                                className={Resolver.Account.isCreditor(account) ? 'Hidden' : ''}
                                variant='warning'
                                icon={mdiCartPlus}/> }
                { !Resolver.Account.isManaged(account) &&<Buttons.Button label='page.transactions.transfer.add'
                                href={`${Resolver.Account.resolveUrl(account)}/transactions/add/transfer`}
                                className={Resolver.Account.isManaged(account) ? 'Hidden' : ''}
                                variant='primary'
                                icon={mdiSwapHorizontal}/> }
            </Buttons.ButtonBar> }

            { !account && <Layout.Loading /> }
            { account && <TransactionList range={ range } account={ account }/> }
        </Layout.Card>
    </>
}

export default AccountDetailView