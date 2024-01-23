import React, { FC } from "react";
import { useAutocomplete } from "../Autocomplete";
import restAPI from "../../repositories/rest-api";
import { Account } from "../../types";
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
    type: 'DEBTOR' | 'CREDITOR',
    title?: string,
    className?: string,
    inputOnly?: boolean,
    onChange?: (_: Account) => void
}

/**
 * The account input is used for autocompletion input for both 'debit' and 'credit' type transactions.
 */
export const AccountInput: FC<AccountInputProps> = (props) => {
    return useAutocomplete<Account>({
            autoCompleteCallback: value => restAPI.get(`accounts/auto-complete?type=${props.type}&token=${value}`),
            entityRender: AccountAutocompleteRow,
            entityLabel: account => account?.name
        },
        props)
}
