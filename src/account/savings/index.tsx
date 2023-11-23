import {BreadCrumbItem, BreadCrumbs, Layout} from "../../core";
import React, {useEffect, useState} from "react";
import {Account} from "../../core/types";
import {useParams} from "react-router-dom";
import AccountRepository from "../../core/repositories/account-repository";
import SavingSummaryComponent from "./saving-goal.component";
import SavingGoalTableComponent from "./saving-goal-table.component";
import TransactionListComponent from "./transaction-list.component";

function SavingAccountOverview() {
    const [account, setAccount] = useState<Account>()
    const {id} = useParams()

    useEffect(() => {
        AccountRepository.get(id)
            .then(setAccount)
    }, [id]);

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label='page.nav.accounts.savings'/>
            <BreadCrumbItem message={ account?.name || 'Loading...' }/>
        </BreadCrumbs>

        <Layout.Card title='page.account.savings.goals'>
            { account && <SavingSummaryComponent savingAccount={ account }/> }

            <hr className='my-5' />

            { account && <SavingGoalTableComponent account={ account } /> }
        </Layout.Card>

        <Layout.Card title='page.account.savings.transactions'>
            { account && <TransactionListComponent account={ account }/> }
        </Layout.Card>
    </>
}

export default SavingAccountOverview