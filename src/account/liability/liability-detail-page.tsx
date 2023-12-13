import React, { useEffect, useState } from 'react'
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Dates,
    Formats,
    Layout,
    Resolver,
    Statistical,
    Translations
} from "../../core";

import AccountRepository from "../../core/repositories/account-repository";
import { mdiCashPlus } from "@mdi/js";
import { useParams } from "react-router-dom";
import { Account, Transaction } from "../../core/types";
import { Range } from "../../core/Dates";
import LiabilityTransactionList from "./liability-transaction-list";

import '../../assets/css/LiabiliryView.scss'
import LiabilityGraph from "./liability-graph";

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
                            <Statistical.Balance accounts={ [{ id: account.id }] }
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

                    <LiabilityGraph account={ account } range={ range } />
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
