import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Translations } from "../../core";
import React, { useEffect, useState } from "react";
import { mdiPlus } from "@mdi/js";
import AccountRepository from "../../core/repositories/account-repository";
import { Account } from "../../core/types";
import AccountRowComponent from "./account-row.component";

const OwnAccountsView = () => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)

    const loadAccounts = () => {
        setAccounts(undefined)
        AccountRepository.own().then(setAccounts)
    }

    useEffect(loadAccounts, [])

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.accounts'/>
            <BreadCrumbItem label='page.nav.accounts.accounts'/>
        </BreadCrumbs>

        <Layout.Card title='page.nav.accounts.accounts' actions={
            [<Buttons.Button label='page.account.accounts.add'
                             key='add'
                             icon={ mdiPlus }
                             href='/accounts/own/add'
                             variant='primary'/>] }>

            <table className='Table'>
                <thead>
                <tr>
                    <th><Translations.Translation label='Account.name'/></th>
                    <th className='w-48 hidden md:table-cell'><Translations.Translation label='Account.number'/></th>
                    <th className='w-40'><Translations.Translation label='common.account.saldo'/></th>
                    <th className='w-7'/>
                </tr>
                </thead>
                <tbody>
                { !accounts && <tr><td colSpan={ 4 }><Layout.Loading /></td></tr> }
                { accounts && !accounts.length && <tr><td colSpan={ 4 } className='text-center text-muted'><Translations.Translation label='common.overview.noresults'/></td></tr> }
                { accounts && accounts.map(a => <AccountRowComponent key={ a.id } account={ a } deleteCallback={ loadAccounts }/>) }
                </tbody>
            </table>
        </Layout.Card>
    </>
}

export default OwnAccountsView