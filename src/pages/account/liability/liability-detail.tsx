import React, { useEffect, useState } from 'react'
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import Translation from "../../../components/localization/translation.component";
import { Dates, Resolver } from "../../../core";
import { Money, Percent } from "../../../core/Formatters";


import AccountRepository from "../../../core/repositories/account-repository";
import { mdiCashPlus } from "@mdi/js";
import { useParams } from "react-router-dom";
import { Balance } from "../../../core/Statistical";
import { Account, Transaction } from "../../../core/types";
import { Range } from "../../../core/Dates";

import LiabilityTransactionList from "../../../components/account/liability-transaction-list.component";
import LiabilityGraph from "../../../components/account/liability-graph.component";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";

import '../../../assets/css/LiabiliryView.scss'

const LiabilityDetailView = () => {
    const [account, setAccount] = useState<Account>()
    const [openingTransaction, setOpeningTransaction] = useState<Transaction>()
    const [range, setRange] = useState<Range>()
    const { id } = useParams()

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

    if (!account || !range) return <Loading />
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
                        <span className='flex-1'><Percent percentage={ account.interest?.interest }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translation label='Account.interestPeriodicity'/>:</label>
                        <span className='flex-1'><Translation label={ `Periodicity.${account.interest?.periodicity}` }/></span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'>
                            <Translation label='page.accounts.liability.startBalance'/>:
                        </label>
                        <span className='flex-1 [&>*]:!text-warning'>
                            <Money money={ openingTransaction?.amount } currency={ account.account.currency } />
                        </span>
                    </div>
                    <div className="flex">
                        <label className='min-w-[8em]'><Translation label='page.accounts.liability.paid'/>:</label>
                        <span className='flex-1'>
                            <Balance accounts={ [{ id: account.id }] }
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
                        <Translation label={ `common.month.${range.start?.getMonth() + 1}` } />
                        { range.start?.getFullYear() }
                        -
                        <Translation label={ `common.month.${range.end?.getMonth() + 1}` } />
                        { range.end?.getFullYear() }
                    </h4>

                    <LiabilityGraph account={ account } range={ range } />
                </Card>
            </div>

            <Card title='page.title.transactions.overview'>
                <Button label='page.account.liability.payment.add'
                                href={`${Resolver.Account.resolveUrl(account)}/transactions/add`}
                                variant='success'
                                className={Resolver.Account.isDebtor(account) ? 'Hidden' : ''}
                                icon={mdiCashPlus}/>

                <LiabilityTransactionList account={ account } range={ range } />
            </Card>
        </div>
    )
}

export default LiabilityDetailView
