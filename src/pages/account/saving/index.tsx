import { mdiSwapHorizontal } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SavingGoalTableComponent from "../../../components/account/saving/saving-goal-table.component";

import SavingSummaryComponent from "../../../components/account/saving/saving-goal.component";
import TransactionListComponent from "../../../components/account/saving/transaction-list.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import { Resolver } from "../../../core";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account } from "../../../types/types";

function SavingAccountOverview() {
    const [account, setAccount] = useState<Account>()
    const { id } = useParams()

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

        <Card title='page.account.savings.goals'>
            { account && <SavingSummaryComponent savingAccount={ account }/> }

            <hr className='my-5' />

            { account && <SavingGoalTableComponent account={ account } /> }
        </Card>

        <Card title='page.account.savings.transactions'>
            { account && <div className='flex justify-end'>
                <Button label='page.transactions.transfer.add'
                                href={ `${ Resolver.Account.resolveUrl(account) }/transactions/add/transfer` }
                                className={ Resolver.Account.isManaged(account) ? 'Hidden' : '' }
                                variant='primary'
                                icon={ mdiSwapHorizontal }/>
            </div> }

            { account && <TransactionListComponent account={ account }/> }
        </Card>
    </>
}

export default SavingAccountOverview