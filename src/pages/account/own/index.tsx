import React, { useEffect, useState } from "react";
import { mdiPlus } from "@mdi/js";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account } from "../../../types/types";
import Translation from "../../../components/localization/translation.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import { i10n } from "../../../config/prime-locale";
import { Card } from "primereact/card";
import { NavLink } from "react-router";
import Icon from "@mdi/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BalanceComponent from "../../../components/balance.component";
import DateComponent from "../../../components/format/date.component";
import OwnAccountMenu from "../../../components/account/own-account-menu";
import { ConfirmDialog } from "primereact/confirmdialog";

const OwnAccountsView = () => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)

    const loadAccounts = () => {
        setAccounts(undefined)
        AccountRepository.own().then(setAccounts)
    }

    useEffect(loadAccounts, [])

    const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
        {i10n('page.nav.accounts.accounts')}
    </div>

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label='page.nav.accounts.accounts'/>
        </BreadCrumbs>

        <ConfirmDialog className='max-w-[25rem]'/>

        <Card className='my-4 mx-2' header={header}>
            <div className='flex justify-end'>
                <NavLink to={'/accounts/own/add'} key='add'
                         className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
                    <Icon path={mdiPlus} size={.8}/> {i10n('page.account.accounts.add')}
                </NavLink>
            </div>

            <DataTable loading={ !accounts } value={ accounts } size='small'>
                <Column header={ i10n('Account.name') } body={ account => <>
                    <NavLink className='text-blue-700'
                             to={`/accounts/${ ['savings', 'joined_savings'].indexOf(account.type) == -1 ? 'own' : 'savings' }/${account.id}/transactions`}>{account.name}</NavLink>
                    <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
                        <label className='font-bold mr-1'><Translation label='Account.type'/>:</label>
                        <Translation className='md:px-0 px-2' label={`AccountType.${account.type}`}/>
                    </div>
                    <div className='text-muted md:pl-1 text-sm flex md:block flex-col'>
                        <label className='font-bold mr-1'><Translation label='Account.lastActivity'/>:</label>
                        <DateComponent className='md:px-0 px-2' date={account.history.lastTransaction}/>
                    </div>
                </>}/>
                <Column header={i10n('Account.number')}
                        body={account => account.account.iban || account.account.number}/>
                <Column header={i10n('common.account.saldo')}
                        className='w-[9rem]'
                        body={(account: Account) => <BalanceComponent accounts={[account]}
                                                                      currency={account.account.currency}/>}/>
                <Column className='w-[1rem]' body={ account => <OwnAccountMenu account={ account } callback={ loadAccounts }/> } />
            </DataTable>
        </Card>
    </>
}

export default OwnAccountsView
