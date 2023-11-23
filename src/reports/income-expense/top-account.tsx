import React, {useEffect, useState} from "react";
import AccountRepository from "../../core/repositories/account-repository";
import {Attachments, Formats, Layout, Translations} from "../../core";
import {Account} from "../../core/types";

type TopAccountTableProps = {
    year: number,
    type: string
}

type TopAccount = {
    account: Account,
    total: number,
    average: number
}

const TopAccountTable = ({year, type}: TopAccountTableProps) => {
    const [accounts, setAccounts] = useState<TopAccount[] | undefined>()

    useEffect(() => {
        AccountRepository.top(type, year)
            .then(setAccounts)
    }, [year, type])

    return (
        <table className='Table TopAccounts'>
            <thead>
            <tr>
                <th colSpan={ 2 }><Translations.Translation label='Account.name'/></th>
                <th><Translations.Translation label='common.total'/></th>
                <th><Translations.Translation label='common.average'/></th>
            </tr>
            </thead>
            <tbody>

            { !accounts && <tr><td colSpan={ 4 }><Layout.Loading /></td></tr> }

            { accounts && accounts.length === 0 && <tr><td colSpan={ 4 } className='text-center muted'><Translations.Translation label='common.overview.noresults'/></td></tr> }

            { accounts && accounts.map(account => (
                <tr key={account.account.id}>
                    <td><Attachments.Image fileCode={account.account.iconFileCode}/></td>
                    <td>{account.account.name}</td>
                    <td><Formats.Money money={account.total * -1} currency={account.account.account.currency}/></td>
                    <td><Formats.Money money={account.average * -1} currency={account.account.account.currency}/></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default TopAccountTable