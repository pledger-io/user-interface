import React, {FC} from "react";
import {useAutocomplete} from "../Autocomplete";
import restAPI from "../../repositories/rest-api";
import {InputGroup} from "../input/InputGroup";
import {EntityShapes} from "../../../config";
import PropTypes from "prop-types";
import {Account} from "../../types";
import {FieldType} from "../form-types";

const AccountAutocompleteRow = (account: Account) => {
    return (
        <span>
            {account.name}
            <span className='iban'>{account.account.iban}</span>
            <div className='Summary'>{account.description}</div>
        </span>
    )
}

type AccountInputProps = FieldType & {
    value?: Account,
    type: 'DEBTOR' | 'CREDITOR',
    title: string
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
