import React, { FC } from "react";
import AccountRepository from "../../../core/repositories/account-repository";
import RestAPI from "../../../core/repositories/rest-api";
import { Account } from "../../../types/types";
import { useAutocomplete } from "../Autocomplete";
import { FieldType } from "../form-types";

const AccountAutocompleteRow = (account: Account) => {
    return (
        <span>
            { account.name }
            <span className='ml-2 text-sm text-muted'>{ account.account.iban }</span>
            <div className='text-muted pl-1 text-sm'>{ account.description }</div>
        </span>
    )
}

type AccountInputProps = FieldType & {
    value?: Account,
    type?: 'debtor' | 'creditor',
    title?: string,
    className?: string,
    inputOnly?: boolean,
    onChange?: (_: Account) => void
}

/**
 * The account input is used for autocompletion input for both 'debit' and 'credit' type transactions.
 */
export const AccountInput: FC<AccountInputProps> = (props) => {
    const onCreateCallback = (name: string) => AccountRepository.create({
            name: name,
            currency: (RestAPI.user() as any).currency,
            type: props.type })
    const { inputOnly = false } = props

    return useAutocomplete<Account>({
            autoCompleteCallback: value => RestAPI.get(`accounts/auto-complete?${props.type ? 'type='+ props.type +'&' : ''}token=${value}`),
            entityRender: AccountAutocompleteRow,
            entityLabel: account => account?.name,
            onCreateCallback: inputOnly ? undefined : onCreateCallback
        },
        props)
}
