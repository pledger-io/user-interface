import React, { useEffect, useState } from 'react'
import BalanceComponent from "../../../components/balance.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import MoneyComponent from "../../../components/format/money.component";
import PercentageComponent from "../../../components/format/percentage.component";
import { Button } from "../../../components/layout/button";
import Translation from "../../../components/localization/translation.component";
import { Resolver } from "../../../core";

import AccountRepository from "../../../core/repositories/account-repository";
import { mdiCashPlus } from "@mdi/js";
import { useParams } from "react-router-dom";
import { Account, Transaction } from "../../../types/types";
import DateRange from "../../../types/date-range.type";

import LiabilityTransactionList from "../../../components/account/liability-transaction-list.component";
import LiabilityGraph from "../../../components/account/liability-graph.component";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";

import '../../../assets/css/LiabiliryView.scss'
import DateRangeService from "../../../service/date-range.service";

const LiabilityDetailView = () => {
    const [account, setAccount] = useState<Account>()
    const [openingTransaction, setOpeningTransaction] = useState<Transaction>()
    const [range, setRange] = useState<DateRange>()
    const { id } = useParams()

    useEffect(() => {
        AccountRepository.get(id).then(setAccount)
        AccountRepository.firstTransaction(id, 'Opening balance')
            .then(setOpeningTransaction)
    }, [id])

    useEffect(() => {
        if (account)
            setRange(DateRangeService.forRange(
                account.history.firstTransaction,
                account.history.lastTransaction))
    }, [account])

    if (!account || !range) return <Loading/>
    return (
        <div>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability' href='/accounts/liability'/>
                <BreadCrumbItem message={ account.name }/>
                <BreadCrumbItem label='page.nav.transactions'/>
            </BreadCrumbs>

            <div className="flex gap-2 flex-wrap">
                <Card className='flex-1'>
                    <h1 className='font-bold'>{ account.name }</h1>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translation label='Account.interest'/>:</label>
                        <span className='flex-1'><PercentageComponent percentage={ account.interest?.interest }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translation label='Account.interestPeriodicity'/>:</label>
                        <span className='flex-1'><Translation
                            label={ `Periodicity.${ account.interest?.periodicity }` }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'>
                            <Translation label='page.accounts.liability.startBalance'/>:
                        </label>
                        <span className='flex-1 [&>*]:!text-warning'>
                            <MoneyComponent money={ openingTransaction?.amount } currency={ account.account.currency }/>
                        </span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translation label='page.accounts.liability.paid'/>:</label>
                        <span className='flex-1'>
                            <BalanceComponent accounts={ [{ id: account.id }] }
                                              income={ true }
                                              currency={ account.account.currency }/>
                        </span>
                    </div>
                </Card>
                <Card className='flex-[2]'>
                    <h1>
                        <Translation label='common.account.balance'/>
                    </h1>
                    <h4>
                        <Translation label={ `common.month.${ range.month() }` }/>
                        { range.year() }
                        -
                        <Translation label={ `common.month.${ range.endMonth() }` }/>
                        { range.endYear() }
                    </h4>

                    <LiabilityGraph account={ account } range={ range }/>
                </Card>
            </div>

            <Card title='page.title.transactions.overview'>
                <Button label='page.account.liability.payment.add'
                        href={ `${ Resolver.Account.resolveUrl(account) }/transactions/add` }
                        variant='success'
                        className={ Resolver.Account.isDebtor(account) ? 'Hidden' : '' }
                        icon={ mdiCashPlus }/>

                <LiabilityTransactionList account={ account } range={ range }/>
            </Card>
        </div>
    )
}

export default LiabilityDetailView
