import { mdiCartPlus, mdiCashPlus, mdiSwapHorizontal } from "@mdi/js";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionList from "../../components/account/transaction-list.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BalanceChart from "../../components/graphs/balance-chart";
import CategorizedPieChart from "../../components/graphs/categorized-pie-chart";
import { Button, ButtonBar } from "../../components/layout/button";

import Card from "../../components/layout/card.component";
import { YearMonth } from "../../components/layout/dropdown";
import Grid from "../../components/layout/grid.component";
import Loading from "../../components/layout/loading.component";
import { Dates, Resolver } from "../../core";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../core/types";

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
                <YearMonth
                    onChange={ onDateChange }
                    minDate={ account?.history?.firstTransaction ? new Date(account.history.firstTransaction) : new Date() }
                    maxDate={ maxDate }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        { isOwnType && <>
            <Card title='common.account.balance'>
                { account && <BalanceChart id='dashboard-balance-graph'
                                           accounts={ account }
                                           allMoney={ true }/> }
                { !account && <Loading /> }
            </Card>

            <Grid type='column' minWidth='20em' className='hidden md:grid'>
                <Card title='page.transactions.expense.category'>
                    <CategorizedPieChart id='category-expenses'
                                                incomeOnly={ false }
                                                accounts={ account }
                                                split='category'/>
                </Card>
                <Card title='page.transactions.expense.budget'>
                    <CategorizedPieChart id='budget-expenses'
                                                incomeOnly={ false }
                                                accounts={ account }
                                                split='budget'/>
                </Card>
                <Card title='page.transactions.income.category'>
                    <CategorizedPieChart id='category-income'
                                                incomeOnly={ true }
                                                accounts={ account }
                                                split='category'/>
                </Card>
            </Grid>
        </> }

        <Card title='page.title.transactions.overview'>
            { account && <ButtonBar className='pb-2 justify-center md:justify-end'>
                { (!Resolver.Account.isManaged(account) || Resolver.Account.isCreditor(account))
                    && <Button label='page.transactions.debit.add'
                                       href={ `${Resolver.Account.resolveUrl(account)}/transactions/add/debit`}
                                       variant='success'
                                       className={Resolver.Account.isDebtor(account) ? 'Hidden' : 'text-xs md:text-[1em]'}
                                       icon={mdiCashPlus}/> }
                { (!Resolver.Account.isManaged(account) || Resolver.Account.isDebtor(account))
                    && <Button label='page.transactions.credit.add'
                                       href={`${Resolver.Account.resolveUrl(account)}/transactions/add/credit`}
                                       className={Resolver.Account.isCreditor(account) ? 'Hidden' : 'text-xs md:text-[1em]'}
                                       variant='warning'
                                       icon={mdiCartPlus}/> }
                { !Resolver.Account.isManaged(account) &&<Button label='page.transactions.transfer.add'
                                                                         href={`${Resolver.Account.resolveUrl(account)}/transactions/add/transfer`}
                                                                         className={Resolver.Account.isManaged(account) ? 'Hidden' : 'text-xs md:text-[1em]'}
                                                                         variant='primary'
                                                                         icon={mdiSwapHorizontal}/> }
            </ButtonBar> }

            { !account && <Loading /> }
            { account && <TransactionList range={ range } account={ account }/> }
        </Card>
    </>
}

export default AccountDetailView